import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="ruled min-h-[70vh]">
      <div className="container-page grid place-items-center py-24 text-center">
        <div>
          <p className="font-display text-[80px] leading-none text-pen">404</p>
          <h1 className="mt-4 text-3xl">That page is not in the syllabus</h1>
          <p className="mt-3 text-[17px] text-muted">The link may be old, or the address may have a typo.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link to="/tutor" className="btn btn-secondary">
              Open the AI Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
