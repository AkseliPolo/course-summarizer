// Course Summarizer.exe: starts the study app.
//
// It serves the app (which is embedded in this file as resources) on a local-only web address,
// keeps progress and added courses as plain files in Documents\Course Summarizer, and opens the
// app in its own window. When that window is closed, the program exits.
//
// Written for the C# 5 compiler that ships with Windows (.NET Framework 4), so it builds
// without installing anything. Build it with:  npm run exe

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

[assembly: AssemblyTitle("Course Summarizer")]
[assembly: AssemblyProduct("Course Summarizer")]
[assembly: AssemblyDescription("Study game: key points read aloud, flashcards, quizzes and stats")]
[assembly: AssemblyVersion("2.0.0.0")]
[assembly: AssemblyFileVersion("2.0.0.0")]

static class Program
{
    const int FirstPort = 47631;
    const int PortCount = 8;
    const int MaxBodyBytes = 20 * 1024 * 1024;

    const string AppName = "Course Summarizer";
    // What the app was called at first. Progress, courses and the browser profile saved under
    // that name are carried over the first time the app starts under its new one.
    const string OldName = "Luntti";

    // Used only when the app is shown in an ordinary browser tab, which this program cannot
    // watch: after this many seconds without a sign of life from the page, it exits.
    const int SilenceLimitSeconds = 180;

    static string dataDir;
    static string coursesDir;
    static string stateFile;
    static string origin;
    static int silentSeconds;
    static readonly object disk = new object();
    static readonly Regex SafeName = new Regex("^[a-z0-9][a-z0-9-]{0,80}$");

    static readonly Dictionary<string, string> ContentTypes = new Dictionary<string, string>
    {
        { ".html", "text/html; charset=utf-8" },
        { ".js", "text/javascript; charset=utf-8" },
        { ".css", "text/css; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".svg", "image/svg+xml" },
        { ".png", "image/png" },
        { ".ico", "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2", "font/woff2" },
    };

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    static extern int MessageBoxW(IntPtr owner, string text, string caption, uint type);

    [STAThread]
    static int Main()
    {
        try
        {
            return Run();
        }
        catch (Exception error)
        {
            MessageBoxW(IntPtr.Zero, AppName + " could not start.\n\n" + error.Message, AppName, 0x10);
            return 1;
        }
    }

    static int Run()
    {
        // COURSE_SUMMARIZER_DATA and COURSE_SUMMARIZER_BROWSER=none exist for testing: another
        // data folder, no window.
        string custom = Environment.GetEnvironmentVariable("COURSE_SUMMARIZER_DATA");
        string documents = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        dataDir = string.IsNullOrEmpty(custom) ? Path.Combine(documents, AppName) : custom;
        BringOldData(Path.Combine(documents, OldName));
        coursesDir = Path.Combine(dataDir, "courses");
        stateFile = Path.Combine(dataDir, "progress.json");
        Directory.CreateDirectory(coursesDir);

        HttpListener listener = null;
        int port = 0;
        for (int i = 0; i < PortCount && listener == null; i++)
        {
            int candidate = FirstPort + i;
            listener = TryListen(candidate);
            if (listener != null)
            {
                port = candidate;
            }
            else if (IsThisApp(candidate))
            {
                // Already running: show its window instead of starting a second copy.
                OpenWindow("http://localhost:" + candidate + "/");
                return 0;
            }
        }
        if (listener == null)
        {
            throw new Exception("Ports " + FirstPort + " to " + (FirstPort + PortCount - 1) + " are all in use by other programs.");
        }
        origin = "http://localhost:" + port;

        Thread server = new Thread(delegate() { Serve(listener); });
        server.IsBackground = true;
        server.Start();

        Process window = OpenWindow(origin + "/");
        DateTime opened = DateTime.UtcNow;
        bool watchingWindow = window != null;

        while (true)
        {
            Thread.Sleep(1000);
            if (watchingWindow)
            {
                if (!window.HasExited) continue;
                // A browser that was already running takes over the window and the process we
                // started exits within a moment. Then the page's own signs of life are all there is.
                if ((DateTime.UtcNow - opened).TotalSeconds > 3) break;
                watchingWindow = false;
            }
            // Counted in loop turns, not clock time, so a sleeping computer does not look like silence.
            if (Interlocked.Increment(ref silentSeconds) > SilenceLimitSeconds) break;
        }

        Thread.Sleep(1500); // let the page's last save arrive
        listener.Stop();
        return 0;
    }

    // ---- Starting --------------------------------------------------------

    static HttpListener TryListen(int port)
    {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
        try
        {
            listener.Start();
            return listener;
        }
        catch (HttpListenerException)
        {
            return null;
        }
    }

    static bool IsThisApp(int port)
    {
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://localhost:" + port + "/api/ping");
            request.Timeout = 1500;
            request.Proxy = null;
            using (WebResponse response = request.GetResponse())
            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            {
                return reader.ReadToEnd().Contains("course-summarizer");
            }
        }
        catch (Exception)
        {
            return false;
        }
    }

    // Edge and Chrome can show a page as an app window of its own, and both bring voices that
    // Windows alone does not have. A separate browser profile makes the window belong to the
    // process started here, so this program can tell when it has been closed.
    static Process OpenWindow(string url)
    {
        if (Environment.GetEnvironmentVariable("COURSE_SUMMARIZER_BROWSER") == "none") return null;

        string browser = FindBrowser();
        if (browser != null)
        {
            string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string home = Path.Combine(local, AppName);
            string oldHome = Path.Combine(local, OldName);
            if (!Directory.Exists(home) && Directory.Exists(oldHome))
            {
                try
                {
                    Directory.Move(oldHome, home);
                }
                catch (Exception)
                {
                    // still in use by a window of the old name: start with a fresh profile
                }
            }
            string profile = Path.Combine(home, "browser");
            Directory.CreateDirectory(profile);
            ProcessStartInfo start = new ProcessStartInfo(browser,
                "--app=" + url +
                " --user-data-dir=\"" + profile + "\"" +
                " --window-size=1240,920 --no-first-run --no-default-browser-check --disable-background-mode" +
                " --disable-features=Translate");
            start.UseShellExecute = false;
            try
            {
                return Process.Start(start);
            }
            catch (Exception)
            {
                // fall through to the default browser
            }
        }

        Process.Start(url);
        return null;
    }

    static string FindBrowser()
    {
        string programs = Environment.GetEnvironmentVariable("ProgramW6432") ?? Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
        string programs86 = Environment.GetEnvironmentVariable("ProgramFiles(x86)") ?? programs;
        string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string[] candidates =
        {
            Path.Combine(programs86, @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(programs, @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(programs, @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(programs86, @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(local, @"Google\Chrome\Application\chrome.exe"),
        };
        foreach (string candidate in candidates)
        {
            if (File.Exists(candidate)) return candidate;
        }
        return null;
    }

    // ---- Serving ---------------------------------------------------------

    static void Serve(HttpListener listener)
    {
        while (listener.IsListening)
        {
            HttpListenerContext context;
            try
            {
                context = listener.GetContext();
            }
            catch (Exception)
            {
                return;
            }
            ThreadPool.QueueUserWorkItem(delegate(object state) { Handle((HttpListenerContext)state); }, context);
        }
    }

    static void Handle(HttpListenerContext context)
    {
        HttpListenerRequest request = context.Request;
        HttpListenerResponse response = context.Response;
        try
        {
            string path = request.Url.AbsolutePath;
            if (path.StartsWith("/api/")) Api(request, response, path);
            else Asset(response, path);
        }
        catch (Exception error)
        {
            try
            {
                Send(response, 500, "text/plain; charset=utf-8", error.Message);
            }
            catch (Exception)
            {
                // the browser has gone away
            }
        }
    }

    static void Api(HttpListenerRequest request, HttpListenerResponse response, string path)
    {
        string method = request.HttpMethod;

        // Only the app's own page may use the API. Other websites open in a browser can send
        // requests to a local address too, so anything that writes must name this origin.
        string from = request.Headers["Origin"];
        if (from != null && from != origin || method != "GET" && from != origin)
        {
            Send(response, 403, "text/plain; charset=utf-8", "Forbidden");
            return;
        }

        if (path == "/api/ping" && method == "GET")
        {
            Interlocked.Exchange(ref silentSeconds, 0);
            Json(response, "{\"app\":\"course-summarizer\"}");
        }
        else if (path == "/api/data" && method == "GET")
        {
            Interlocked.Exchange(ref silentSeconds, 0);
            Json(response, ReadEverything());
        }
        else if (path == "/api/state" && method == "PUT")
        {
            string body = ReadBody(request);
            if (!body.TrimStart().StartsWith("{")) { Send(response, 400, "text/plain; charset=utf-8", "Expected a JSON object"); return; }
            WriteFile(stateFile, body, true);
            Json(response, "{\"ok\":true}");
        }
        else if (path.StartsWith("/api/courses/") && (method == "PUT" || method == "DELETE"))
        {
            string name = path.Substring("/api/courses/".Length);
            if (!SafeName.IsMatch(name)) { Send(response, 400, "text/plain; charset=utf-8", "Bad course name"); return; }
            string file = Path.Combine(coursesDir, name + ".json");
            if (method == "PUT")
            {
                string body = ReadBody(request);
                if (!body.TrimStart().StartsWith("{")) { Send(response, 400, "text/plain; charset=utf-8", "Expected a JSON object"); return; }
                WriteFile(file, body, false);
            }
            else
            {
                RemoveCourse(file, name);
            }
            Json(response, "{\"ok\":true}");
        }
        else if (path == "/api/open-folder" && method == "PUT")
        {
            Process.Start("explorer.exe", "\"" + dataDir + "\"");
            Json(response, "{\"ok\":true}");
        }
        else
        {
            Send(response, 404, "text/plain; charset=utf-8", "Not found");
        }
    }

    static void Asset(HttpListenerResponse response, string path)
    {
        if (path == "/") path = "/index.html";
        Stream resource = Assembly.GetExecutingAssembly().GetManifestResourceStream("web" + path);
        if (resource == null)
        {
            Send(response, 404, "text/plain; charset=utf-8", "Not found");
            return;
        }
        using (resource)
        {
            string type;
            if (!ContentTypes.TryGetValue(Path.GetExtension(path).ToLowerInvariant(), out type)) type = "application/octet-stream";
            // File names under /assets/ change whenever their content does, so they can be cached for good.
            response.Headers["Cache-Control"] = path.StartsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-store";
            response.Headers["X-Content-Type-Options"] = "nosniff";
            response.StatusCode = 200;
            response.ContentType = type;
            response.ContentLength64 = resource.Length;
            resource.CopyTo(response.OutputStream);
            response.OutputStream.Close();
        }
    }

    // ---- Files -----------------------------------------------------------

    // The first start under the new name: what was saved under the old one is copied into the
    // new data folder. The old folder is left exactly as it was. The copy is made beside the
    // new folder and moved into place at the end, so a copy that fails halfway leaves nothing behind.
    static void BringOldData(string oldDir)
    {
        if (Directory.Exists(dataDir) || !Directory.Exists(oldDir)) return;
        string staging = dataDir + ".copying";
        if (Directory.Exists(staging)) Directory.Delete(staging, true);
        CopyFolder(oldDir, staging);
        Directory.Move(staging, dataDir);
    }

    static void CopyFolder(string from, string to)
    {
        Directory.CreateDirectory(to);
        foreach (string file in Directory.GetFiles(from))
        {
            File.Copy(file, Path.Combine(to, Path.GetFileName(file)));
        }
        foreach (string folder in Directory.GetDirectories(from))
        {
            CopyFolder(folder, Path.Combine(to, Path.GetFileName(folder)));
        }
    }

    // Everything the app needs at start, in one answer. File contents travel as strings, so a
    // course file that is not valid JSON cannot break the whole answer: the app reports it by name.
    static string ReadEverything()
    {
        StringBuilder json = new StringBuilder();
        lock (disk)
        {
            json.Append("{\"folder\":").Append(Quote(dataDir));
            json.Append(",\"state\":").Append(File.Exists(stateFile) ? Quote(File.ReadAllText(stateFile)) : "null");
            json.Append(",\"courses\":[");
            string[] files = Directory.GetFiles(coursesDir, "*.json");
            Array.Sort(files, StringComparer.OrdinalIgnoreCase);
            for (int i = 0; i < files.Length; i++)
            {
                if (i > 0) json.Append(',');
                json.Append("{\"name\":").Append(Quote(Path.GetFileNameWithoutExtension(files[i])));
                json.Append(",\"text\":").Append(Quote(File.ReadAllText(files[i]))).Append('}');
            }
            json.Append("]}");
        }
        return json.ToString();
    }

    // Writes to a temporary file first and then swaps it in, so a crash mid-write cannot leave
    // a half-written file. For progress, the previous version is kept beside it as a .bak.
    static void WriteFile(string file, string text, bool keepBackup)
    {
        lock (disk)
        {
            string temp = file + ".tmp";
            File.WriteAllText(temp, text, new UTF8Encoding(false));
            if (File.Exists(file)) File.Replace(temp, file, keepBackup ? file + ".bak" : null);
            else File.Move(temp, file);
        }
    }

    // A removed course is moved aside, not deleted, so it can be put back by hand.
    static void RemoveCourse(string file, string name)
    {
        lock (disk)
        {
            if (!File.Exists(file)) return;
            string removed = Path.Combine(coursesDir, "removed");
            Directory.CreateDirectory(removed);
            File.Move(file, Path.Combine(removed, name + "-" + DateTime.Now.ToString("yyyyMMdd-HHmmss") + ".json"));
        }
    }

    // ---- HTTP helpers ----------------------------------------------------

    static string ReadBody(HttpListenerRequest request)
    {
        if (request.ContentLength64 > MaxBodyBytes) throw new Exception("The request is too large.");
        using (StreamReader reader = new StreamReader(request.InputStream, Encoding.UTF8))
        {
            return reader.ReadToEnd();
        }
    }

    static void Json(HttpListenerResponse response, string json)
    {
        Send(response, 200, "application/json; charset=utf-8", json);
    }

    static void Send(HttpListenerResponse response, int status, string type, string text)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(text);
        response.Headers["Cache-Control"] = "no-store";
        response.Headers["X-Content-Type-Options"] = "nosniff";
        response.StatusCode = status;
        response.ContentType = type;
        response.ContentLength64 = bytes.Length;
        response.OutputStream.Write(bytes, 0, bytes.Length);
        response.OutputStream.Close();
    }

    static string Quote(string text)
    {
        StringBuilder quoted = new StringBuilder(text.Length + 16);
        quoted.Append('"');
        foreach (char c in text)
        {
            switch (c)
            {
                case '"': quoted.Append("\\\""); break;
                case '\\': quoted.Append("\\\\"); break;
                case '\n': quoted.Append("\\n"); break;
                case '\r': quoted.Append("\\r"); break;
                case '\t': quoted.Append("\\t"); break;
                default:
                    // 0x2028 and 0x2029 are line separators, which JSON allows in strings but JavaScript did not.
                    if (c < 32 || c == 0x2028 || c == 0x2029) quoted.Append('\\').Append('u').Append(((int)c).ToString("x4"));
                    else quoted.Append(c);
                    break;
            }
        }
        quoted.Append('"');
        return quoted.ToString();
    }
}
