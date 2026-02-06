"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioPausedByUser, setAudioPausedByUser] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const areaRef = useRef(null);
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);
  const audioRef = useRef(null);
  const blockYesUntilRef = useRef(0);

  const moveNoButton = (playAudio = true) => {
    const area = areaRef.current;
    const btn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!area || !btn) return;

    const maxX = area.clientWidth - btn.offsetWidth;
    const maxY = area.clientHeight - btn.offsetHeight;
    if (maxX <= 0 || maxY <= 0) return;

    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;
    const areaRect = area.getBoundingClientRect();
    const overlapsYes = (x, y) => {
      if (!yesRect) return false;
      const left = areaRect.left + x;
      const top = areaRect.top + y;
      const right = left + btn.offsetWidth;
      const bottom = top + btn.offsetHeight;
      return !(
        right < yesRect.left ||
        left > yesRect.right ||
        bottom < yesRect.top ||
        top > yesRect.bottom
      );
    };

    let nextX = 0;
    let nextY = 0;
    let attempts = 0;
    do {
      nextX = Math.random() * maxX;
      nextY = Math.random() * maxY;
      attempts += 1;
    } while (attempts < 24 && overlapsYes(nextX, nextY));

    btn.style.left = `${nextX}px`;
    btn.style.top = `${nextY}px`;
    btn.style.opacity = "1";
    if (playAudio) {
      enableAudio();
    }
  };

  useEffect(() => {
    const touch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    setAudioEnabled(false);
    setAudioPausedByUser(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.muted = true;
    }
  }, []);

  useEffect(() => {
    if (!showResult) {
      requestAnimationFrame(() => {
        moveNoButton(false);
      });
    }
  }, [showResult]);

  const enableAudio = () => {
    if (audioPausedByUser) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = volume;
    audio.play().catch(() => {});
    setAudioEnabled(true);
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
    moveNoButton(true);
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setAudioPausedByUser(!next);
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
          {audioEnabled ? (
            <svg className="audio-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1.5" />
              <rect x="14" y="5" width="4" height="14" rx="1.5" />
            </svg>
          ) : (
            <svg className="audio-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.6v12.8a1.2 1.2 0 0 0 1.8 1.04l9.2-6.4a1.2 1.2 0 0 0 0-2.08l-9.2-6.4A1.2 1.2 0 0 0 8 5.6z" />
            </svg>
          )}
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
