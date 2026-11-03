"""Progress report for families (informe.html): built from the teacher panel, every section filled, Spanish and English, phone and PDF."""
from harness import Env, check, run, now_iso, OUT
import datetime as dt, os, re


def seed(env, sid):
    now = dt.datetime.now(dt.timezone.utc)
    iso = lambda d: (now - dt.timedelta(days=d)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    day = lambda d: (now - dt.timedelta(days=d)).strftime("%Y-%m-%d")
    prog = {
        "attempts.01": [{"ok": 13, "n": 20, "at": iso(20)}, {"ok": 17, "n": 20, "at": iso(18)}], "diploma.01": {"ok": 17, "n": 20, "at": iso(18)}, "done.01": [0, 1, 2, 3, 4, 5, 6, 7],
        "attempts.02": [{"ok": 18, "n": 20, "at": iso(1)}], "diploma.02": {"ok": 18, "n": 20, "at": iso(1)}, "done.02": [0, 1, 2, 3, 4, 5, 6],
        "attempts.03": [{"ok": 12, "n": 20, "at": iso(0)}], "done.03": [0, 1, 2],
        "game": {"xp": 590, "days": {day(20): 120, day(18): 150, day(8): 90, day(1): 130, day(0): 100}, "best": 3},
        "counters": {"spoken": 24, "dictation": 9}, "words": ["engine", "tires", "fast", "garage"], "reviewLearned": 5,
        "review": {"r1": {"id": "r1", "l": "02.final", "p": "My uncle has an Xbox.", "a": "has"}, "r2": {"id": "r2", "l": "03.gaps", "p": "She ___ up at 6 every day.", "a": "gets"}},
        "placement": {"nivel": "A2", "fecha": day(25), "r": None},
    }
    env.DB["progress"][sid] = {"user_id": sid, "updated_at": iso(0), "data": {k: {"v": v, "t": 1} for k, v in prog.items()}}
    env.DB["student_settings"][sid] = {"student_id": sid, "lessons": ["01", "02", "03", "04", "05", "06"], "theme": "racing"}
    for k, (d, st, lid, notes, words) in enumerate([(20, "attended", "01", "Introduced himself without notes. Still says 'I have 15' sometimes.", "nickname, hometown"),
                                                   (13, "missed", "02", "", ""), (6, "attended", "02", "Described his dream car with have / has and colors. Great energy.", "engine, tires, wheel"),
                                                   (1, "attended", "03", "Daily routine and telling the time. Needs practice with -s in third person.", "wake up, get dressed")]):
        env.DB["classes"][f"c{k}"] = {"id": f"c{k}", "student_id": sid, "starts_at": iso(d), "status": st, "lesson_id": lid, "notes": notes, "words": words}
    env.DB["homework"]["h1"] = {"id": "h1", "student_id": sid, "title": "Final quiz · Lesson 02 My Garage", "due": day(3), "done_at": iso(4), "created_at": iso(6), "grade": 90, "feedback": "Very good, watch has / have."}
    env.DB["homework"]["h2"] = {"id": "h2", "student_id": sid, "title": "Describe your routine in 5 sentences", "due": day(-3), "created_at": iso(1)}


def test():
    with Env() as env:
        T = env.teacher()
        e = env.account(T, "Emiliano Sánchez", "emiliano.sanchez"); seed(env, e)
        env.fresh(T, f"teacher.html#reports/{e}/30", 1500)
        T.fill("#rpC", "Emiliano avanzó muy bien este mes. Ya se presenta solo y describe su carro ideal. Vamos a reforzar la rutina diaria."); T.wait_for_timeout(1500)
        src = T.get_attribute("#rpFrame", "src")
        check(src and "informe.html?d=" in src and "embed=1" in src, "Reports shows a live preview of the family document")
        url = src.replace("&embed=1", "")

        F = env.device("F", 1100, 1000); F.goto(url); F.wait_for_timeout(900)
        txt = F.inner_text("#doc")
        for part in ["CLASES DE INGLÉS", "Reporte de avance", "EMILIANO SÁNCHEZ", "Evaluación del periodo", "Asistencia", "3 de 4 clases", "Tareas a tiempo", "Constancia", "Nivel actual", "Lecciones aprobadas", "Calendario de práctica", "Mejor logro", "Meta para el siguiente periodo", "Folio ES-", "Preparado por", "Emiliano tomó 3 clases (faltó a 1)", "Lo que practicó entre clases", "Frases dichas bien con el micrófono",
                     "Lecciones", "65% → 85%", "Lo que vimos en cada clase", "Described his dream car", "wheel", "Faltó", "Tareas", "Entregada", "Pendiente", "90",
                     "Para repasar", "My uncle has an Xbox.", "has", "Próximos pasos", "Continuar con la lección", "Comentario del instructor", "Ya se presenta solo", "Alejandro Caporali"]:
            check(part.lower() in txt.lower(), f"report shows “{part}”")
        F.screenshot(path=os.path.join(OUT, "report_es.png"), full_page=True)
        F.click('[data-l="en"]'); F.wait_for_timeout(300)
        txt = F.inner_text("#doc")
        txt = txt.lower(); check("english classes" in txt and "class log" in txt and "next steps" in txt and "a note from the teacher" in txt, "EN button switches the whole report to English")
        F.set_viewport_size({"width": 390, "height": 844}); F.click('[data-l="es"]'); F.wait_for_timeout(300)
        sw = F.evaluate("document.documentElement.scrollWidth"); check(sw <= 392, f"report fits a phone (width {sw})")
        F.screenshot(path=os.path.join(OUT, "report_phone.png"), full_page=True)
        F.set_viewport_size({"width": 1100, "height": 1000}); F.emulate_media(media="print"); F.wait_for_timeout(200)
        F.pdf(path=os.path.join(OUT, "report.pdf"), format="Letter", print_background=True, prefer_css_page_size=True)
        check(os.path.getsize(os.path.join(OUT, "report.pdf")) > 20000, "report saves as PDF")

        # old links (sent before this version) still open
        old = re.sub(r"d=[^&]+", "d=" + T.evaluate("""() => { const D = {v:1,n:"Ada",g:new Date().toISOString(),p:"30",f:"2026-10-01",t:"2026-10-30",lv:"B1",k:{cls:[2,0],days:3,pdays:1,passed:1,lessons:4,done:1,avg:88,xp:300,hw:[1,1],words:0,spoken:0,dict:0,rv:0},tr:null,sc:[["2026-10-10",88,"122"]],wk:[["10-05",100]],att:[["2026-10",2,0]],tp:[["122","Life at the Stables",8,10,88,"2026-10-10"]],st:[],op:[],nt:[]};
            const b = new TextEncoder().encode(JSON.stringify(D)); let s = ""; b.forEach(c => s += String.fromCharCode(c)); return btoa(s).replace(/\\+/g,"-").replace(/\\//g,"_").replace(/=+$/,""); }"""), url)
        F.goto(old); F.wait_for_timeout(700)
        check("Life at the Stables" in F.inner_text("#doc"), "reports sent before this change still open")
        # each student's style gives the report its own palette
        F.goto(url); F.wait_for_timeout(500)
        check(F.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--jeo').trim()") == "#c8102e", "Racing student gets the racing palette")
        check(not env.errs, "no page errors: " + "; ".join(env.errs[:3]))


if __name__ == "__main__":
    run(test)
