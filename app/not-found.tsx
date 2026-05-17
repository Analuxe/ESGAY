import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="room-wrapper fade-in not-found-main">
      <h1 className="glitch-layer not-found-h1" data-text="404: Sector Collapsed">
        404: Sector Collapsed
      </h1>
      <p className="not-found-error">
        [ ERROR: The old maps are useless here. ]
      </p>
      
      <div className="cracked-border not-found-box">
        <p className="not-found-quote">
          &ldquo;The infrastructure here has decayed beyond recognition. <br/><span className="not-found-highlight">There is nothing left to salvage.</span>&rdquo;
        </p>
        <Link href="/" className="subversive-btn not-found-btn">
          Return to the Embassy
        </Link>
      </div>
    </main>
  );
}
