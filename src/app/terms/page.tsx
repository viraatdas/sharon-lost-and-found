import Link from 'next/link';

export const metadata = { title: 'Terms — Sharon Lost + Found' };

export default function Terms() {
  return (
    <main className="legal">
      <Link className="wordmark" href="/"><span className="mark">✦</span> sharon <i>lost + found</i></Link>
      <h1>Terms</h1>
      <p>Sharon Lost + Found is a free, best-effort community board for reuniting people at Sharon with things they&rsquo;ve lost. By using it, here&rsquo;s what you&rsquo;re agreeing to.</p>
      <h2>Use it in good faith</h2>
      <p>Post real finds, mark something claimed only once it&rsquo;s actually been picked up, and only enter someone&rsquo;s phone number if you genuinely think the item is theirs.</p>
      <h2>Texting</h2>
      <p>If you enter a phone number when posting a find, that person will receive exactly one text (optionally with a photo) about it. Standard message and data rates may apply on their end.</p>
      <h2>No warranty</h2>
      <p>This board is provided as-is, with no guarantee items will be found, texts will be delivered, or the service will always be available.</p>
      <h2>Questions</h2>
      <p>Reach out at <a href="mailto:viraat@exla.ai">viraat@exla.ai</a>.</p>
      <Link href="/" className="back">← Back to the board</Link>
    </main>
  );
}
