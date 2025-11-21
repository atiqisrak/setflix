interface VideoErrorProps {
  error: string;
  onClose: () => void;
}

export default function VideoError({ error, onClose }: VideoErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <div className="text-center text-white px-4">
        <p className="text-lg font-semibold mb-2">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

