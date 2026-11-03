"""Run every test. Exit code 0 = all passed (the deploy only publishes when this passes).
    python tests/run_all.py            all tests
    python tests/run_all.py accounts   only tests whose name contains "accounts"
"""
import glob, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
only = sys.argv[1:]
files = sorted(f for f in glob.glob(os.path.join(HERE, "test_*.py")) if not only or any(o in os.path.basename(f) for o in only))
t0, failed = time.time(), []
for f in files:
    r = subprocess.run([sys.executable, f], cwd=HERE)
    if r.returncode: failed.append(os.path.basename(f))
print("\n" + ("✓ all %d test files passed" % len(files) if not failed else "✗ failed: " + ", ".join(failed)) + f" · {time.time() - t0:.0f}s")
sys.exit(1 if failed else 0)
