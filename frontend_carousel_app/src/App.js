import React from "react";
import "./index.css";
import Carousel from "./components/Carousel";

/**
 * PUBLIC_INTERFACE
 * Top-level App: renders the product carousel within a themed layout.
 */
function App() {
  const slides = [
    {
      title: "Streamline your workflow",
      description:
        "Boost productivity with intuitive tools designed for modern teams. Collaborate faster and ship with confidence.",
      primaryCta: "Get Started",
      primaryHref: "#",
      secondaryText: "See features",
      onSecondary: () => console.log("See features clicked")
    },
    {
      title: "Secure and reliable",
      description:
        "Enterprise-grade security with fine-grained controls. Your data stays safe with built-in best practices.",
      primaryCta: "Request a demo",
      primaryHref: "#",
      secondaryText: "Read docs",
      onSecondary: () => console.log("Read docs clicked")
    },
    {
      title: "Scale without limits",
      description:
        "Architecture built for performance and growth. Effortlessly scale from startup to global.",
      primaryCta: "View pricing",
      primaryHref: "#",
      secondaryText: "Contact sales",
      onSecondary: () => console.log("Contact sales clicked")
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-ocean-background">
      <main className="w-full">
        <div className="mx-auto max-w-screen-md">
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-ocean-text">
              Product Highlights
            </h1>
            <p className="text-ocean-text/70 mt-2">
              Explore what’s new and powerful. Use arrows or dots to navigate.
            </p>
          </header>
          <Carousel slides={slides} />
        </div>
      </main>
    </div>
  );
}

export default App;
