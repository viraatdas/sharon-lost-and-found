'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, MessageCircle, Plus, Send, Share2, X } from 'lucide-react';

type Item = { id: number; name: string; date: string; color: string; emoji: string; claimed?: boolean; image?: string; guessName?: string; guessPhone?: string };

const starterItems: Item[] = [
  { id: 1, name: 'Black paw-print tee', date: 'Today', color: 'sun', emoji: '👕', image: '/finds/IMG_8037.jpg' },
  { id: 2, name: 'Brown gathered top', date: 'Today', color: 'lilac', emoji: '👚', image: '/finds/IMG_8038.jpg' },
  { id: 3, name: 'Plaid button-up', date: 'Today', color: 'sky', emoji: '👔', image: '/finds/IMG_8039.jpg' },
  { id: 4, name: 'Black Apple tee', date: 'Today', color: 'leaf', emoji: '👕', image: '/finds/IMG_8040.jpg' },
  { id: 5, name: 'Dinosaur museum hoodie', date: 'Today', color: 'peach', emoji: '🧥', image: '/finds/IMG_8041.jpg' },
  { id: 6, name: 'Taupe corduroy pants', date: 'Today', color: 'rose', emoji: '👖', image: '/finds/IMG_8042.jpg' },
  { id: 7, name: 'Sage green tee', date: 'Today', color: 'leaf', emoji: '👕', image: '/finds/IMG_8043.jpg' },
];

const tones = ['sun', 'lilac', 'sky', 'leaf', 'peach', 'rose'];
const storageKey = 'sharon-lost-found-items';

function ItemArt({ item }: { item: Item }) {
  return item.image ? <img src={item.image} alt={item.name} /> : <span aria-hidden="true">{item.emoji}</span>;
}

const noopSubscribe = () => () => {};
function useCanShare() {
  return useSyncExternalStore(noopSubscribe, () => typeof navigator.share === 'function', () => false);
}

async function shareFind(name: string) {
  try {
    await navigator.share({ title: 'Sharon Lost + Found', text: `I think Sharon Lost + Found found this — is it yours? ${name}`, url: 'https://sharonlostandfound.viraat.dev' });
  } catch {
    /* they backed out of the share sheet */
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>(starterItems);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    const hydrate = window.setTimeout(() => setItems(JSON.parse(saved)), 0);
    return () => window.clearTimeout(hydrate);
  }, []);
  const saveItems = (next: Item[]) => { setItems(next); window.localStorage.setItem(storageKey, JSON.stringify(next)); };
  const unclaimed = useMemo(() => items.filter((item) => !item.claimed), [items]);
  const claimed = useMemo(() => items.filter((item) => item.claimed), [items]);
  const openItem = items.find((item) => item.id === openId) ?? null;
  const claim = (id: number) => { saveItems(items.map((item) => item.id === id ? { ...item, claimed: true } : item)); setOpenId(null); setNotice('Claimed — glad this made its way home.'); };
  const saveGuess = (id: number, guessName: string, guessPhone: string) => { saveItems(items.map((item) => item.id === id ? { ...item, guessName: guessName || undefined, guessPhone: guessPhone || undefined } : item)); setNotice('Saved.'); };

  return (
    <main id="top">
      <header className="topbar">
        <a className="wordmark" href="#top"><span className="mark">✦</span> sharon <i>lost + found</i></a>
        <div className="top-actions"><a href="#board">Browse board</a><button className="button small" onClick={() => setUploadOpen(true)}><Plus size={16} /> Add a find</button></div>
      </header>
      <section className="board" id="board">
        <div className="section-head"><h2>Lost + found</h2></div>
        <div className="item-grid">
          {unclaimed.map((item) => (
            <div className={`item-card tone-${item.color}`} key={item.id} role="button" tabIndex={0}
              onClick={() => setOpenId(item.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(item.id); } }}>
              <div className="photo"><ItemArt item={item} /></div>
              <div className="card-copy"><h3>{item.name}</h3></div>
            </div>
          ))}
        </div>
        {!unclaimed.length && <div className="empty">Nothing on the board right now.</div>}
        {!!claimed.length && (
          <>
            <div className="section-head claimed-head"><h2>Claimed</h2></div>
            <div className="item-grid claimed-grid">
              {claimed.map((item) => (
                <div className="item-card claimed-card tone-mono" key={item.id} role="button" tabIndex={0}
                  onClick={() => setOpenId(item.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(item.id); } }}>
                  <div className="photo"><ItemArt item={item} /><div className="claimed-stamp">Claimed <Check size={15} /></div></div>
                  <div className="card-copy"><h3>{item.name}</h3></div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      <section className="qr-section"><div className="qr"><QRCodeSVG value="https://sharonlostandfound.viraat.dev" size={112} bgColor="#f4b345" fgColor="#18382c" includeMargin /></div><div><h2>Scan to see the board.</h2><p>Print this code for the lobby.</p></div><button className="text-button print" onClick={() => window.print()}>Print the code <span>↗</span></button></section>
      <footer><span>Made for the people of Sharon</span><a href="#top">Back to top ↑</a></footer>
      <section className="print-flyer" aria-hidden="true">
        <p className="print-mark">✦</p>
        <h1>Sharon Lost + Found</h1>
        <div className="print-qr"><QRCodeSVG value="https://sharonlostandfound.viraat.dev" size={220} bgColor="#f4b345" fgColor="#18382c" includeMargin /></div>
        <p className="print-line">Scan to see what&rsquo;s been found</p>
        <p className="print-url">sharonlostandfound.viraat.dev</p>
      </section>
      {notice && <div className="toast"><Check size={16} /> {notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onAdd={(item, smsNote) => { saveItems([item, ...items]); setUploadOpen(false); setNotice(`Your find is on the board.${smsNote}`); }} />}
      {openItem && <ItemModal item={openItem} onClose={() => setOpenId(null)} onClaim={claim} onSaveGuess={saveGuess} />}
    </main>
  );
}

function UploadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: Item, smsNote: string) => void }) {
  const [photo, setPhoto] = useState(''); const [name, setName] = useState(''); const [guessName, setGuessName] = useState(''); const [guessPhone, setGuessPhone] = useState(''); const [sending, setSending] = useState(false); const input = useRef<HTMLInputElement>(null);
  const canShare = useCanShare();
  const pickPhoto = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setPhoto(String(reader.result)); reader.readAsDataURL(file); } };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name) return;
    const item: Item = { id: Date.now(), name, date: 'Just now', color: tones[Math.floor(Math.random() * tones.length)], emoji: '📦', image: photo || undefined, guessName: guessName || undefined, guessPhone: guessPhone || undefined };
    let smsNote = '';
    if (guessPhone) {
      setSending(true);
      try {
        const response = await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: guessPhone, item: name }) });
        const data = await response.json();
        smsNote = data.delivered ? ` Text sent to ${guessName || 'them'}!` : ` ${data.reason ?? data.error ?? 'Could not send the text.'}`;
      } catch { smsNote = ' Could not send the text.'; }
      setSending(false);
    }
    onAdd(item, smsNote);
  };
  return <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Add a found item"><form className="modal upload-modal" onSubmit={submit}><button type="button" className="close" onClick={onClose}><X /></button><p className="kicker">Add a find</p><h2>Let’s get it home.</h2><label className="photo-upload" onClick={() => input.current?.click()}>{photo ? <img src={photo} alt="Your selected item" /> : <><span>＋</span><b>Add a photo</b></>}<input ref={input} type="file" accept="image/*" onChange={pickPhoto} /></label><label>What did you find?<input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. navy umbrella" required /></label><div className="notify-block"><p className="notify-label"><MessageCircle size={16} /> Know whose it might be?</p>{canShare && <><button type="button" className="button small share-btn" onClick={() => shareFind(name || 'this find')}><Share2 size={15} /> Share with them</button><p className="notify-divider">or text it for me</p></>}<label>I think it might be…<input value={guessName} onChange={(e) => setGuessName(e.target.value)} placeholder="e.g. Alex" /></label><label>Their phone number<input value={guessPhone} onChange={(e) => setGuessPhone(e.target.value)} type="tel" placeholder="(304) 555-0123" /></label></div><button className="button full" type="submit" disabled={sending}>{sending ? 'Sending…' : <>Post to the board <Send size={17} /></>}</button></form></div>;
}

function ItemModal({ item, onClose, onClaim, onSaveGuess }: { item: Item; onClose: () => void; onClaim: (id: number) => void; onSaveGuess: (id: number, guessName: string, guessPhone: string) => void }) {
  const [guessName, setGuessName] = useState(item.guessName ?? '');
  const [guessPhone, setGuessPhone] = useState(item.guessPhone ?? '');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const canShare = useCanShare();

  const save = (event: FormEvent) => { event.preventDefault(); onSaveGuess(item.id, guessName, guessPhone); setStatus('Saved.'); };
  const text = async () => {
    if (!guessPhone) return;
    setSending(true); setStatus('');
    try {
      const response = await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: guessPhone, item: item.name }) });
      const data = await response.json();
      setStatus(data.delivered ? `Text sent to ${guessName || 'them'}!` : data.reason ?? data.error ?? 'Could not send the text.');
    } catch { setStatus('Could not send the text.'); }
    setSending(false);
  };

  return <div className="modal-wrap" role="dialog" aria-modal="true" aria-label={item.name}>
    <div className="modal detail-modal">
      <button type="button" className="close" onClick={onClose}><X /></button>
      <div className={`detail-photo tone-${item.color}`}><ItemArt item={item} />{item.claimed && <div className="claimed-stamp big">Claimed <Check size={16} /></div>}</div>
      <div className="detail-copy">
        <p className="kicker">Found {item.date}</p>
        <h2>{item.name}</h2>
        <form className="notify-block" onSubmit={save}>
          <p className="notify-label"><MessageCircle size={16} /> Who might this be?</p>
          {canShare && <><button type="button" className="button small share-btn" onClick={() => shareFind(item.name)}><Share2 size={15} /> Share with them</button><p className="notify-divider">or text it for me</p></>}
          <label>I think it might be…<input value={guessName} onChange={(e) => setGuessName(e.target.value)} placeholder="e.g. Alex" /></label>
          <label>Their phone number<input value={guessPhone} onChange={(e) => setGuessPhone(e.target.value)} type="tel" placeholder="(304) 555-0123" /></label>
          <div className="guess-actions">
            <button className="button small" type="submit">Save</button>
            <button className="button small" type="button" disabled={!guessPhone || sending} onClick={text}>{sending ? 'Sending…' : <>Text them <Send size={15} /></>}</button>
          </div>
          {status && <small className="guess-status">{status}</small>}
        </form>
        {!item.claimed ? <button className="button full" type="button" onClick={() => onClaim(item.id)}><Check size={17} /> This is mine</button> : <p className="claimed-line"><Check size={16} /> Claimed</p>}
      </div>
    </div>
  </div>;
}
