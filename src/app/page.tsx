'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, MapPin, MessageCircle, Plus, Search, Send, X } from 'lucide-react';

type Item = { id: number; name: string; detail: string; place: string; date: string; category: string; color: string; emoji: string; claimed?: boolean; image?: string };

const starterItems: Item[] = [
  { id: 1, name: 'Black paw-print tee', detail: 'Black T-shirt with a small white paw print on the chest.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'sun', emoji: '👕', image: '/finds/IMG_8037.jpg' },
  { id: 2, name: 'Brown gathered top', detail: 'Brown top with gathered sleeves and a soft texture.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'lilac', emoji: '👚', image: '/finds/IMG_8038.jpg' },
  { id: 3, name: 'Plaid button-up', detail: 'Green, navy, and tan plaid shirt with two front pockets.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'sky', emoji: '👔', image: '/finds/IMG_8039.jpg' },
  { id: 4, name: 'Black Apple tee', detail: 'Black shirt with a small white Apple logo.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'leaf', emoji: '👕', image: '/finds/IMG_8040.jpg' },
  { id: 5, name: 'Dinosaur museum hoodie', detail: 'Light blue hoodie from the American Museum of Natural History.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'peach', emoji: '🧥', image: '/finds/IMG_8041.jpg' },
  { id: 6, name: 'Taupe corduroy pants', detail: 'Soft taupe corduroy trousers.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'rose', emoji: '👖', image: '/finds/IMG_8042.jpg' },
  { id: 7, name: 'Sage green tee', detail: 'Plain sage green short-sleeve shirt.', place: 'Sharon', date: 'Today', category: 'Clothing', color: 'leaf', emoji: '👕', image: '/finds/IMG_8043.jpg' },
];

const storageKey = 'sharon-lost-found-items';

function ItemArt({ item }: { item: Item }) {
  return item.image ? <img src={item.image} alt={item.name} /> : <span aria-hidden="true">{item.emoji}</span>;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>(starterItems);
  const [query, setQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    const hydrate = window.setTimeout(() => setItems(JSON.parse(saved)), 0);
    return () => window.clearTimeout(hydrate);
  }, []);
  const saveItems = (next: Item[]) => { setItems(next); window.localStorage.setItem(storageKey, JSON.stringify(next)); };
  const visible = useMemo(() => items.filter((item) =>
    `${item.name} ${item.detail}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, query]);
  const claim = (id: number) => { saveItems(items.map((item) => item.id === id ? { ...item, claimed: true } : item)); setSelected(null); setNotice('Claim marked — glad this made its way home.'); };

  return (
    <main id="top">
      <header className="topbar">
        <a className="wordmark" href="#top"><span className="mark">✦</span> sharon <i>lost + found</i></a>
        <div className="top-actions"><a href="#board">Browse board</a><button className="button small" onClick={() => setUploadOpen(true)}><Plus size={16} /> Add a find</button></div>
      </header>
      <section className="board" id="board">
        <div className="section-head"><div><h2>Lost + found</h2></div><p className="board-note">Tap a photo for details<br />or to claim it.</p></div>
        <div className="controls"><div className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the board" /></div></div>
        <div className="item-grid">{visible.map((item) => <button className={`item-card tone-${item.color}`} key={item.id} onClick={() => setSelected(item)}><div className="photo"><ItemArt item={item} />{item.claimed && <div className="claimed-stamp">Claimed <Check size={15} /></div>}</div><div className="card-copy"><h3>{item.name}</h3><p><MapPin size={13} /> {item.place}</p></div></button>)}</div>
        {!visible.length && <div className="empty">Nothing quite like that yet. Try another search.</div>}
      </section>
      <section className="qr-section"><div className="qr"><QRCodeSVG value="https://sharonlostandfound.viraat.dev" size={112} bgColor="#f4b345" fgColor="#18382c" includeMargin /></div><div><h2>Scan to see the board.</h2><p>Print this code for the lobby.</p></div><button className="text-button print" onClick={() => window.print()}>Print the code <span>↗</span></button></section>
      <footer><span>Made for the people of Sharon</span><a href="#top">Back to top ↑</a></footer>
      {notice && <div className="toast"><Check size={16} /> {notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onAdd={(item) => { saveItems([item, ...items]); setUploadOpen(false); setNotice('Your find is on the board. Thank you, neighbor.'); }} />}
      {selected && <DetailModal item={items.find((item) => item.id === selected.id) ?? selected} onClose={() => setSelected(null)} onClaim={claim} />}
    </main>
  );
}

function UploadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: Item) => void }) {
  const [photo, setPhoto] = useState(''); const [name, setName] = useState(''); const [place, setPlace] = useState(''); const [detail, setDetail] = useState(''); const input = useRef<HTMLInputElement>(null);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!name || !place) return; onAdd({ id: Date.now(), name, place, detail: detail || 'Found at Sharon.', category: 'Everyday', date: 'Just now', color: 'sun', emoji: '📦', image: photo }); };
  const pickPhoto = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setPhoto(String(reader.result)); reader.readAsDataURL(file); } };
  return <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Add a found item"><form className="modal upload-modal" onSubmit={submit}><button type="button" className="close" onClick={onClose}><X /></button><p className="kicker">Add a find</p><h2>Let’s get it home.</h2><label className="photo-upload" onClick={() => input.current?.click()}>{photo ? <img src={photo} alt="Your selected item" /> : <><span>＋</span><b>Add a photo</b><small>Best clue wins</small></>}<input ref={input} type="file" accept="image/*" onChange={pickPhoto} /></label><label>What did you find?<input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. navy umbrella" required /></label><label>Where was it?<input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. roof deck" required /></label><label>Anything that helps identify it?<textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Color, label, distinctive details…" /></label><button className="button full" type="submit">Post to the board <Send size={17} /></button></form></div>;
}

function DetailModal({ item, onClose, onClaim }: { item: Item; onClose: () => void; onClaim: (id: number) => void }) {
  const [phone, setPhone] = useState(''); const [status, setStatus] = useState('');
  const nudge = async (event: FormEvent) => { event.preventDefault(); setStatus(''); const response = await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, item: item.name }) }); const data = await response.json(); setStatus(data.delivered ? 'Text sent — fingers crossed!' : data.reason ?? data.error ?? 'Could not send the text.'); };
  return <div className="modal-wrap" role="dialog" aria-modal="true" aria-label={item.name}><div className="modal detail-modal"><button className="close" onClick={onClose}><X /></button><div className={`detail-image tone-${item.color}`}><ItemArt item={item} />{item.claimed && <div className="claimed-stamp big">Claimed <Check size={16} /></div>}</div><div className="detail-copy"><p className="kicker">{item.category} · Found {item.date}</p><h2>{item.name}</h2><p>{item.detail}</p><p className="location"><MapPin size={16} /> Found at {item.place}</p>{!item.claimed && <><button className="button full" onClick={() => onClaim(item.id)}><Check size={17} /> This is mine</button><div className="nudge"><div><MessageCircle size={18} /><b>Know whose it is?</b></div><p>Send them a gentle heads-up.</p><form onSubmit={nudge}><input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Their phone number" required /><button aria-label="Send message"><Send size={17} /></button></form>{status && <small>{status}</small>}</div></>}</div></div></div>;
}
