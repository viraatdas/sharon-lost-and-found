import Link from 'next/link';

export const metadata = { title: 'Privacy — Sharon Lost + Found' };

export default function Privacy() {
  return (
    <main className="legal">
      <Link className="wordmark" href="/"><span className="mark">✦</span> sharon <i>lost + found</i></Link>
      <h1>Privacy</h1>
      <p>Sharon Lost + Found is a small community lost-and-found board. This page covers what happens to information you give it.</p>
      <h2>What we collect</h2>
      <p>When you post a find, we keep the item name, an optional photo, and — if you fill it in — the name and phone number of who you think the item belongs to. That&rsquo;s stored to run the board and, if you provide a phone number, to send one text about the find.</p>
      <h2>How it&rsquo;s used</h2>
      <p>A phone number you enter is used for exactly one purpose: sending a single transactional text (and, where supported, a photo of the item) letting that person know something that might be theirs was found, with a link back to this board. We don&rsquo;t send anything else, and we don&rsquo;t sell, share, or use it for marketing.</p>
      <h2>Where it lives</h2>
      <p>The board itself is stored in your browser. Text messages are sent through our messaging providers (currently AWS End User Messaging and Twilio) solely to deliver that one message.</p>
      <h2>Questions</h2>
      <p>Reach out at <a href="mailto:viraat@exla.ai">viraat@exla.ai</a>.</p>
      <Link href="/" className="back">← Back to the board</Link>
    </main>
  );
}
