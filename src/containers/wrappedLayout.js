import React, { useEffect, useState } from "react";
import "./wrappedLayout.scss";
import { SUCCESS_STATUS } from "../constants/status";

const touch = matchMedia("(hover: none)").matches;

const wrappedLayout = config => Component => {
  const { image, parallax, backgroundFigure } = config;

  function stepped(update, start, end, duration) {
    const range = end - start;
    const minTimer = 50;

    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);

    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;

    function run() {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - remaining * range);

      update(value + "%");

      if (value === end) {
        clearInterval(timer);
      }
    }
    timer = setInterval(run, stepTime);
    run();
  }

  const Wrapped = ({ ...props }) => {
    const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });
    const [figurePosition, setFigurePosition] = useState("100%");

    const { status } = props;
    const isLoaded = status === SUCCESS_STATUS;

    useEffect(() => {
      if (!parallax) return;
      if (touch) return;

      document.addEventListener("mousemove", e => {
        setCursorPosition({ left: e.pageX, top: e.pageY });
      });

      return () => {
        document.removeEventListener("mousemove", null);
      };
    }, []);

    useEffect(() => {
      if (isLoaded) {
        stepped(setFigurePosition, 100, 50, 500);
      }
    }, [isLoaded]);

    const getPosition = speed => {
      if (!parallax) return {};
      const MOVE_SPEED = speed;
      let x = cursorPosition.left * MOVE_SPEED;
      let y = cursorPosition.top * MOVE_SPEED;

      return {
        transform: `translate(${x}px, ${y}px)`,
      };
    };

    return (
      <section className="game-section" style={{ "--figure": `${figurePosition}` }}>
        {image && isLoaded && (
          <div className="game-section__image-container">
            <img
              className="game-section__image"
              style={getPosition(0.03)}
              src="./images/hand.svg"
              alt=""
            />
          </div>
        )}

        {backgroundFigure && (
          <div className="game-section__figure" style={getPosition(0.015)}></div>
        )}

        <div className="game-section__content">
          <Component {...props} />
        </div>
      </section>
    );
  };
  return Wrapped;
};

export default wrappedLayout;
