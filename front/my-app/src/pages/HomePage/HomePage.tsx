import type { FC } from "react";
import { useState } from "react"; // Добавили useState
import { Link } from "react-router-dom";
import './HomePage.css';
import { ROUTES } from '../../Routes';

export const HomePage: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className="home-page">
      {/* Hero секция с картинкой */}
      <section className="hero">
        <header>
          <h1>
            <Link to="/">
              <img src="http://localhost:9000/staticimages/image.svg" alt="home" />
            </Link>
          </h1>
        </header>
      </section>

      <main>
        <div className="welcome-section">
          <h2>Добро пожаловать в химическую лабораторию</h2>
          <p className="subtitle">Исследуйте химические реактивы и создавайте смеси</p>
          
          {/* Карусель */}
          <div className="carousel-container">
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              
              {/* Слайд 1: Инструкция */}
              <div className="carousel-slide">
                <h3>Как это работает?</h3>
                <div className="instruction-grid">
                  <div className="step-item">
                    <span className="step-num">1</span>
                    <p>Перейдите в <Link to={ROUTES.CHEMICALS}>раздел элементы</Link></p>
                  </div>
                  <div className="step-item">
                    <span className="step-num">2</span>
                    <p>Выберите интересующие вас элементы</p>
                  </div>
                  <div className="step-item">
                    <span className="step-num">3</span>
                    <p>Изучите подробную информацию о них</p>
                  </div>
                  <div className="step-item">
                    <span className="step-num">4</span>
                    <p>Создайте автоматический расчет pH</p>
                  </div>
                </div>
              </div>

              {/* Слайд 2: Заглушка / Преимущества */}
              <div className="carousel-slide">
                <h3>История исследований</h3>
                <div className="placeholder-content">
                  <p>Сохраняйте свои эксперименты и возвращайтесь к ним в любое время.</p>
                  <ul className="benefits-list">
                    <li>📁 Личный архив смесей</li>
                    <li>⏱ Экономия времени на расчетах</li>
                    <li>📊 Точные формулы концентрации</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Кнопки управления */}
            <button className="carousel-btn prev" onClick={prevSlide}>&#10094;</button>
            <button className="carousel-btn next" onClick={nextSlide}>&#10095;</button>

            {/* Индикаторы (точки) */}
            <div className="carousel-indicators">
              <span 
                className={`dot ${currentSlide === 0 ? 'active' : ''}`} 
                onClick={() => setCurrentSlide(0)}
              />
              <span 
                className={`dot ${currentSlide === 1 ? 'active' : ''}`} 
                onClick={() => setCurrentSlide(1)}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
