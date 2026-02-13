import Navbar from "@/components/Navbar";
import StatusGrid from "@/components/StatusGrid";

const Status = () => {
  return (
    <div className="min-h-screen pt-14">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <StatusGrid />
      </div>
    </div>
  );
};

export default Status;
