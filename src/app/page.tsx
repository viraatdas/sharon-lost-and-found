'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, ChevronDown, MapPin, MessageCircle, Plus, Search, Send, Sparkles, X } from 'lucide-react';

type Item = { id: number; name: string; detail: string; place: string; date: string; category: string; color: string; emoji: string; claimed?: boolean; image?: string };

const starterItems: Item[] = [
  { id: 1, name: 'Black sunglasses', detail: 'Round frames, small gold detail on the arm.', place: 'Lobby sofa', date: 'Today', category: 'Accessories', color: 'sun', emoji: '🕶️' },
  { id: 2, name: 'Lilac water bottle', detail: 'Metal bottle with a few tiny flower stickers.', place: 'Gym', date: 'Yesterday', category: 'Everyday', color: 'lilac', emoji: '🧴' },
  { id: 3, name: 'Key ring with blue fob', detail: 'Three keys and a little ceramic moon charm.', place: 'Mail room', date: 'Tuesday', category: 'Keys', color: 'sky', emoji: '🔑', claimed: true },
  { id: 4, name: 'Canvas tote', detail: 'Natural canvas, “read more” in green type.', place: 'Laundry room', date: 'Monday', category: 'Bags', color: 'leaf', emoji: '👜' },
  { id: 5, name: 'AirPods case', detail: 'White case, initials “M.K.” underneath.', place: 'Courtyard', date: 'Sunday', category: 'Tech', color: 'peach', emoji: '🎧' },
  { id: 6, name: 'Striped beanie', detail: 'Soft knit, navy and oatmeal stripes.', place: 'Package room', date: 'Sep 4', category: 'Clothing', color: 'rose', emoji: '🧶' },
];

const categories = ['Everything', 'Keys', 'Tech', 'Bags', 'Accessories', 'Clothing', 'Everyday'];
const storageKey = 'sharon-lost-found-items';

function ItemArt({ item }: { item: Item }) {
  return item.image ? <img src={item.image} alt={item.name} /> : <span aria-hidden="true">{item.emoji}</span>;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>(starterItems);
  const [filter, setFilter] = useState('Everything');
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
    (filter === 'Everything' || item.category === filter) && `${item.name} ${item.detail}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, filter, query]);
  const claim = (id: number) => { saveItems(items.map((item) => item.id === id ? { ...item, claimed: true } : item)); setSelected(null); setNotice('Claim marked — glad this made its way home.'); };

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top"><span className="mark">✦</span> sharon <i>lost + found</i></a>
        <div className="top-actions"><a href="#board">Browse board</a><button className="button small" onClick={() => setUploadOpen(true)}><Plus size={16} /> Add a find</button></div>
      </header>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">A neighborly noticeboard</p>
          <h1>Little things<br /><em>find their way</em><br />home.</h1>
          <p className="intro">Spotted something around Sharon? Post it here, nudge the person it might belong to, and make somebody’s day.</p>
          <div className="hero-buttons"><button className="button" onClick={() => setUploadOpen(true)}><Plus size={18} /> I found something</button><a href="#board" className="text-button">See what’s here <span>↓</span></a></div>
        </div>
        <div className="hero-scene" aria-label="A collection of found objects">
          <div className="sun-blob" /><div className="scene-note">found near the<br />front door</div><div className="scene-item scene-keys">🔑</div><div className="scene-item scene-glasses">🕶️</div><div className="scene-item scene-plant">🪴</div><div className="scene-tape" />
        </div>
      </section>
      <section className="how"><div><span>01</span><strong>Spot it</strong><p>Pick it up, snap a photo.</p></div><div><span>02</span><strong>Post it</strong><p>Add where you found it.</p></div><div><span>03</span><strong>Reunite it</strong><p>Help it get back home.</p></div><aside><Sparkles size={19} /> <b>6</b> things are waiting for their people</aside></section>
      <section className="board" id="board">
        <div className="section-head"><div><p className="kicker">The board</p><h2>Waiting to be claimed</h2></div><p className="board-note">Tap a find for the full story<br />and to claim it.</p></div>
        <div className="controls"><div className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the board" /></div><div className="filters">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div></div>
        <div className="item-grid">{visible.map((item) => <button className={`item-card tone-${item.color}`} key={item.id} onClick={() => setSelected(item)}><div className="photo"><ItemArt item={item} />{item.claimed && <div className="claimed-stamp">Claimed <Check size={15} /></div>}</div><div className="card-copy"><span>{item.category} <i>·</i> {item.date}</span><h3>{item.name}</h3><p><MapPin size={13} /> {item.place}</p></div></button>)}</div>
        {!visible.length && <div className="empty">Nothing quite like that yet. Try another search.</div>}
      </section>
      <section className="qr-section"><div className="qr"><QRCodeSVG value="https://sharonlostandfound.viraat.dev" size={112} bgColor="#f4b345" fgColor="#18382c" includeMargin /></div><div><p className="kicker">Put us on the wall</p><h2>A code for the lobby.</h2><p>Print this QR code and pin it wherever things tend to get left behind. A quick scan opens the board.</p></div><button className="text-button print" onClick={() => window.print()}>Print the code <span>↗</span></button></section>
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
