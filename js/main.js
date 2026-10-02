/* =========================================================
           ТАЙМЕР
        ========================================================= */

const countDownDate = new Date("Nov 28, 2026 13:00:00").getTime();

setInterval(function () {
  const now = new Date().getTime();

  const distance = countDownDate - now;

  document.getElementById("weeks").innerHTML = String(
    Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24 * 7))),
  ).padStart(2, "0");

  document.getElementById("days").innerHTML = String(
    Math.max(
      0,
      Math.floor(
        (distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24),
      ),
    ),
  ).padStart(2, "0");

  document.getElementById("hours").innerHTML = String(
    Math.max(
      0,
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    ),
  ).padStart(2, "0");

  document.getElementById("mins").innerHTML = String(
    Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
  ).padStart(2, "0");

  document.getElementById("secs").innerHTML = String(
    Math.max(0, Math.floor((distance % (1000 * 60)) / 1000)),
  ).padStart(2, "0");
}, 1000);

/* =========================================================
           СВАДЕБНОЕ РАСПИСАНИЕ
        ========================================================= */

const timeline = document.getElementById("timeline");

const svgPath = document.getElementById("curve-path");

const heart = document.getElementById("scroll-heart");

/* =========================================================
           ПОСТРОЕНИЕ ПУНКТИРА
        ========================================================= */

function drawPath() {
  const h = timeline.clientHeight;

  const w = timeline.clientWidth;

  const center = w / 2;

  /*
                НА ТЕЛЕФОНЕ:

                идеально прямая линия.
            */

  if (window.innerWidth <= 600) {
    const d = `
                        M ${center} 0
                        L ${center} ${h}
                    `;

    svgPath.setAttribute("d", d);

    return;
  }

  /*
                НА КОМПЬЮТЕРЕ:

                большая плавная змейка.

                Амплитуда увеличена,
                чтобы пунктир действительно
                использовал ширину композиции.
            */

  const amplitude = Math.min(w * 0.2, 220);

  const d = `
                    M ${center} 0

                    C
                    ${center + amplitude} ${h * 0.1},
                    ${center + amplitude} ${h * 0.2},
                    ${center} ${h * 0.28}

                    C
                    ${center - amplitude} ${h * 0.36},
                    ${center - amplitude} ${h * 0.46},
                    ${center} ${h * 0.54}

                    C
                    ${center + amplitude} ${h * 0.62},
                    ${center + amplitude} ${h * 0.72},
                    ${center} ${h * 0.8}

                    C
                    ${center - amplitude * 0.75} ${h * 0.87},
                    ${center - amplitude * 0.55} ${h * 0.94},
                    ${center} ${h}
                `;

  svgPath.setAttribute("d", d);
}

/* =========================================================
           ПОЗИЦИЯ СЕРДЕЧКА
        ========================================================= */

function placeHeartAtProgress(progress) {
  const pathLength = svgPath.getTotalLength();

  if (!pathLength) {
    return;
  }

  /*
                ЗДЕСЬ НЕТ НИКАКОГО 0.96.

                0 = абсолютное начало линии.

                1 = абсолютный конец линии.

                Именно этого ты хотела.
            */

  const point = svgPath.getPointAtLength(progress * pathLength);

  heart.style.left = point.x + "px";

  heart.style.top = point.y + "px";
}

/* =========================================================
           ДВИЖЕНИЕ СЕРДЕЧКА ПО СКРОЛЛУ
        ========================================================= */

function updateHeart() {
  const rect = timeline.getBoundingClientRect();

  /*
                Начало движения:

                верхняя часть расписания
                появляется в зоне просмотра.
            */

  const startPoint = window.innerHeight * 0.85;

  /*
                Конец движения:

                нижний край расписания
                доходит до нижней части экрана.

                Здесь progress обязательно
                достигает 1.
            */

  const endPoint = -rect.height + window.innerHeight * 0.15;

  const distance = startPoint - endPoint;

  let progress = (startPoint - rect.top) / distance;

  /*
                Строго ограничиваем диапазон
                от 0 до 1.

                Никаких 0.96,
                никаких 0.98.
            */

  progress = Math.max(0, Math.min(1, progress));

  placeHeartAtProgress(progress);
}

/* =========================================================
           ОБНОВЛЕНИЕ
        ========================================================= */

function refreshTimeline() {
  drawPath();

  /*
                После построения SVG
                сердечко сразу получает
                правильную точку.
            */

  updateHeart();
}

/* =========================================================
           ЗАПУСК
        ========================================================= */

window.addEventListener("load", function () {
  requestAnimationFrame(function () {
    refreshTimeline();
  });
});

/*
            Перестраиваем линию,
            если изменился размер окна.
        */

window.addEventListener("resize", function () {
  refreshTimeline();
});

/*
            Движение сердечка
            при прокрутке.
        */

window.addEventListener(
  "scroll",
  function () {
    updateHeart();
  },
  {
    passive: true,
  },
);

/*
            Дополнительный пересчёт после
            загрузки изображений и шрифтов.
        */

setTimeout(refreshTimeline, 500);

setTimeout(refreshTimeline, 1200);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;

    target.classList.add("animate__animated");
    observer.unobserve(target);
  });
});

document
  .querySelectorAll(".animate-on-scroll")
  .forEach((element) => observer.observe(element));
