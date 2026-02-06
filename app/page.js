"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const areaRef = useRef(null);
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);
  const audioRef = useRef(null);
  const blockYesUntilRef = useRef(0);

  const moveNoButton = () => {
    const area = areaRef.current;
    const btn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!area || !btn) return;

    const maxX = area.clientWidth - btn.offsetWidth;
    const maxY = area.clientHeight - btn.offsetHeight;
    if (maxX <= 0 || maxY <= 0) return;

    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;

    btn.style.left = `${nextX}px`;
    btn.style.top = `${nextY}px`;
    btn.style.opacity = "1";

    if (yesBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      const areaRect = area.getBoundingClientRect();
      const left = areaRect.left + nextX;
      const top = areaRect.top + nextY;
      const right = left + btn.offsetWidth;
      const bottom = top + btn.offsetHeight;
      const overlap = !(
        right < yesRect.left ||
        left > yesRect.right ||
        bottom < yesRect.top ||
        top > yesRect.bottom
      );
      btn.style.zIndex = overlap ? "5" : "3";
    }

    enableAudio();
  };

  useEffect(() => {
    const touch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
  }, []);

  useEffect(() => {
    if (!showResult) {
      requestAnimationFrame(() => {
        moveNoButton();
      });
    }
  }, [showResult]);

  const enableAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = volume;
    audio.play().catch(() => {});
  };

  const handleYesClick = () => {
    if (Date.now() < blockYesUntilRef.current) return;
    enableAudio();
    setShowResult(true);
  };

  const handleNoPress = (event) => {
    event.preventDefault();
    event.stopPropagation();
    blockYesUntilRef.current = Date.now() + 350;
    moveNoButton();
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !next;
    audio.volume = volume;
    if (next) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  return (
    <main className="page">
      <div className="glow" aria-hidden="true" />
      <audio ref={audioRef} src="/musique.mp3" loop preload="auto" />

      {!showResult && (
        <section className="card question-card">
          <img
            className="poster"
            src="/lol2.jpg"
            alt="Affiche du film LOL 2"
          />
          <h1>Justine, veux-tu aller voir LOL 2 au cinéma avec moi ?</h1>

          <div className="buttons-area" ref={areaRef}>
            <button
              className="btn btn-yes"
              type="button"
              onClick={handleYesClick}
              ref={yesBtnRef}
            >
              Oui
            </button>

            <button
              className="btn btn-no"
              type="button"
              ref={noBtnRef}
              onMouseEnter={!isTouch ? moveNoButton : undefined}
              onMouseOver={!isTouch ? moveNoButton : undefined}
              onPointerDown={handleNoPress}
              onClick={handleNoPress}
              onTouchStart={handleNoPress}
              onFocus={moveNoButton}
            >
              Non
            </button>
          </div>
        </section>
      )}

      {showResult && (
        <section className="card result-card">
          <img src="/oui.gif" alt="Gif de joie" />
          <p>Je savais que t&apos;allais dire oui 🤪</p>
        </section>
      )}

      <div className="audio-control">
        <button
          type="button"
          className={`audio-toggle ${audioEnabled ? "on" : ""}`}
          onClick={toggleAudio}
          aria-pressed={audioEnabled}
        >
          {audioEnabled ? "⏸" : "▶"}
        </button>
        <input
          className="audio-range"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
      </div>
    </main>
  );
}
