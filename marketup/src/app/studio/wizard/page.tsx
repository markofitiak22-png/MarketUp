"use client";
import { useEffect, useMemo, useState } from "react";

type StepKey = "avatar" | "voice" | "backgrounds" | "script" | "review";

const languages = ["en", "uk", "ar", "tr", "sv"];
const voices = [
  { id: "female_calm", label: "Female / Calm" },
  { id: "female_energetic", label: "Female / Energetic" },
  { id: "male_calm", label: "Male / Calm" },
  { id: "male_fast", label: "Male / Fast" },
];

export default function WizardPage() {
  const [step, setStep] = useState<StepKey>("avatar");
  const [avatar, setAvatar] = useState("Classic");
  const [language, setLanguage] = useState("en");
  const [voice, setVoice] = useState(voices[0].id);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [script, setScript] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const canContinue = useMemo(() => {
    if (step === "avatar") return Boolean(avatar);
    if (step === "voice") return Boolean(language && voice);
    if (step === "backgrounds") return backgrounds.length >= 1 && backgrounds.length <= 4;
    if (step === "script") return script.trim().length >= 10;
    return true;
  }, [step, avatar, language, voice, backgrounds, script]);

  function addTo(list: string[], setter: (v: string[]) => void, value: string, max: number) {
    const v = value.trim();
    if (!v) return;
    if (list.includes(v)) return;
    if (list.length >= max) return;
    setter([...list, v]);
  }

  async function submit() {
    setSubmitting(true);
    setStatus("PROCESSING");
    try {
      const res = await fetch("/api/video-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          backgroundImageUrls: backgrounds,
          productImageUrls: products,
          contactAddress,
          contactPhone,
          logoImageUrl,
          meta: { avatar, language, voice },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "error");
      setJobId(data.id);
    } catch (e) {
      setSubmitting(false);
      setStatus("FAILED");
    }
  }

  useEffect(() => {
    if (!jobId) return;
    let active = true;
    const iv = setInterval(async () => {
      const r = await fetch(`/api/video-jobs/${jobId}`);
      const j = await r.json();
      if (!active) return;
      setStatus(j.status);
      if (j.status === "COMPLETED") {
        setVideoUrl(j.videoUrl || null);
        setSubmitting(false);
        clearInterval(iv);
      }
      if (j.status === "FAILED") {
        setSubmitting(false);
        clearInterval(iv);
      }
    }, 1200);
    return () => {
      active = false;
    };
  }, [jobId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Video Creation Wizard</h1>

      {!jobId ? (
        <div className="glass rounded-xl p-4 grid gap-5">
          {step === "avatar" && (
            <div className="grid gap-3">
              <h2 className="font-semibold">Choose avatar</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {['Classic','Modern','Business'].map((a) => (
                  <button key={a} className={`rounded border px-3 py-2 ${avatar===a? 'btn-primary': ''}`} onClick={() => setAvatar(a)}>{a}</button>
                ))}
              </div>
              <div className="flex justify-between">
                <div />
                <button disabled={!canContinue} className="btn-primary rounded px-4 py-2" onClick={() => setStep("voice")}>Next</button>
              </div>
            </div>
          )}

          {step === "voice" && (
            <div className="grid gap-3">
              <h2 className="font-semibold">Language & Voice</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <select value={language} onChange={(e)=>setLanguage(e.target.value)}>
                  {languages.map(l=> <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={voice} onChange={(e)=>setVoice(e.target.value)}>
                  {voices.map(v=> <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>
              <div className="flex justify-between">
                <button className="btn-outline rounded px-4 py-2" onClick={() => setStep("avatar")}>Back</button>
                <button disabled={!canContinue} className="btn-primary rounded px-4 py-2" onClick={() => setStep("backgrounds")}>Next</button>
              </div>
            </div>
          )}

          {step === "backgrounds" && (
            <div className="grid gap-3">
              <h2 className="font-semibold">Backgrounds and product images</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <UrlList title="Background image URL" items={backgrounds} setItems={setBackgrounds} max={4} />
                <UrlList title="Product image URL" items={products} setItems={setProducts} max={6} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input placeholder="Logo image URL (optional)" value={logoImageUrl} onChange={(e)=>setLogoImageUrl(e.target.value)} />
                <input placeholder="Contact phone (optional)" value={contactPhone} onChange={(e)=>setContactPhone(e.target.value)} />
              </div>
              <input placeholder="Contact address (optional)" value={contactAddress} onChange={(e)=>setContactAddress(e.target.value)} />
              <div className="flex justify-between">
                <button className="btn-outline rounded px-4 py-2" onClick={() => setStep("voice")}>Back</button>
                <button disabled={!canContinue} className="btn-primary rounded px-4 py-2" onClick={() => setStep("script")}>Next</button>
              </div>
            </div>
          )}

          {step === "script" && (
            <div className="grid gap-3">
              <h2 className="font-semibold">Script</h2>
              <textarea rows={10} placeholder="Write your pitch..." value={script} onChange={(e)=>setScript(e.target.value)} />
              <div className="flex justify-between">
                <button className="btn-outline rounded px-4 py-2" onClick={() => setStep("backgrounds")}>Back</button>
                <button disabled={!canContinue} className="btn-primary rounded px-4 py-2" onClick={() => setStep("review")}>Next</button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="grid gap-3">
              <h2 className="font-semibold">Review & generate</h2>
              <p className="text-sm opacity-80">Avatar: {avatar} · Lang: {language} · Voice: {voice}</p>
              <p className="text-sm opacity-80">Backgrounds: {backgrounds.length} · Products: {products.length}</p>
              <button disabled={submitting} className="btn-primary rounded px-4 py-2" onClick={submit}>Generate video</button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass rounded-xl p-6 grid place-items-center text-center gap-3">
          {status !== "COMPLETED" ? (
            <>
              <div className="h-8 w-8 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
              <p className="text-sm opacity-80">Generating your video… ({status})</p>
            </>
          ) : (
            <>
              <p className="text-sm opacity-80">Done!</p>
              {videoUrl ? <a className="btn-primary rounded px-4 py-2" href={videoUrl} target="_blank">Open video</a> : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function UrlList({ title, items, setItems, max }: { title: string; items: string[]; setItems: (v: string[])=>void; max: number; }) {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-2">
      <label className="text-sm">{title}</label>
      <div className="flex gap-2">
        <input value={value} onChange={(e)=>setValue(e.target.value)} placeholder="https://…" />
        <button className="btn-outline rounded px-3" onClick={()=>{ const v=value.trim(); if(!v) return; if(items.includes(v)) return; if(items.length>=max) return; setItems([...items,v]); setValue(""); }}>Add</button>
      </div>
      <ul className="text-xs opacity-80 grid gap-1">
        {items.map((u)=> (
          <li key={u} className="flex items-center justify-between gap-2 bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1">
            <span className="truncate">{u}</span>
            <button className="text-red-400" onClick={()=> setItems(items.filter(x=>x!==u))}>Remove</button>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-[var(--muted)]">{items.length}/{max}</p>
    </div>
  );
}


