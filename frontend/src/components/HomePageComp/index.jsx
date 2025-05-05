import React from "react";
import { Sparkles, Ticket, Camera, BookOpenCheck, Share2 } from "lucide-react";
import Logo from "../../assets/SVGs/damy-logo.svg";
import { useNavigate } from "react-router";
import UploadTicketImage from "../../assets/images/AiUse.png";
import AddMemoriesImage from "../../assets/images/archive.png";
import ConnectImage from "../../assets/images/following.png";
import Collage from "../../assets/images/ticketCollage.jpg";

export default function HomePage() {

  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-base-200">
      {/* Navigation Bar */}
      <header className="flex justify-between items-center px-6 py-5 bg-base-100 shadow-sm">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="CollecTic Logo" className="w-40 h-15" />
        </div>
      </header>
        <img
              src={Collage}
              alt="Collage"
              className="w-full h-32 object-cover shadow mb-4 mx-auto"
            />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center items-center py-10 px-3">

        <h1 className="text-3xl font-black mb-8 tracking-tight leading-tight">
          Organize your <span className="text-primary">ticketed memories</span>
        </h1>
        <p className="text-1xl text-base-content/80 mb-6 max-w-3xl mx-auto">
          Upload, enrich, and share your collectible tickets with the world. Join a passionate community of memory-keepers.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="btn btn-primary btn-lg text-lg px-8" onClick={() => navigate("/sign-up")}>Start Collecting</button>
          <p className="mt-6 w-full text-base text-base-content/70 text-center">
            Already have an account?{' '}
            <span
              onClick={() => navigate("/sign-in")}
              className="text-primary font-semibold cursor-pointer hover:underline"
            >
              Sign in here
            </span>
            .
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 border-t  sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto py-16 px-6">
        <div className="card bg-base-100 shadow-1xl hover:scale-105 transition-transform duration-300">
          <div className="card-body items-center text-center">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="card-title">Upload Your Tickets</span>
            </div>
            <img
              src={UploadTicketImage}
              alt="Upload Ticket Preview"
              className="w-32 h-64 object-cover rounded-lg shadow mb-4"
            />
            <p>Snap a photo or upload your physical ticket to start your digital collection.</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-1xl hover:scale-105 transition-transform duration-300">
          <div className="card-body items-center text-center">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-success" />
              <span className="card-title">Add Event Memories</span>
            </div>
            <img
              src={AddMemoriesImage}
              alt="Upload Ticket Preview"
              className="w-32 h-64 object-cover rounded-lg shadow mb-4"
            />
            <p>Include personal photos and notes to relive the moment.</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-1xl hover:scale-105 transition-transform duration-300">
          <div className="card-body items-center text-center">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" />
              <span className="card-title">Connect & Share</span>
            </div>
            <img
              src={ConnectImage}
              alt="Upload Ticket Preview"
              className="w-32 h-64 object-cover rounded-lg shadow mb-4"
            />
            <p>Follow other collectors, be followed, and share your collection with the community.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-100 border-t py-10 px-6 text-center text-gray-600">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg font-semibold">Meet the Team</p>
          <p className="mb-4">We’re a group of passionate creators, developers, and collectors on a mission to preserve memories through tickets.</p>
          <p className="italic">“Our dream is to turn every ticket into a story worth remembering.”</p>
        </div>
      </footer>

    </main>
  );
}


