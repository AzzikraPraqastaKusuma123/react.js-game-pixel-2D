import React, { useEffect, useRef } from "react";
import kaboom from "kaboom";

// Data untuk portofolio Anda
const portfolioData = {
  bio: "Saya adalah seorang pengembang web dengan fokus pada React dan Kaboom.js. Saya senang membuat pengalaman interaktif dan game.",
  skills: [
    { name: "JavaScript", level: "Expert" },
    { name: "React", level: "Intermediate" },
    { name: "Kaboom.js", level: "Beginner" },
  ],
  projects: [
    { name: "Game Portfolio", githubLink: "https://github.com/user/game-portfolio" },
    { name: "Web App", githubLink: "https://github.com/user/web-app" },
  ],
  contact: {
    email: "contoh@email.com",
    linkedin: "https://linkedin.com/in/contoh",
    github: "https://github.com/contoh",
  },
};

// Komponen utama aplikasi
const App = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1E1E1E',
      fontFamily: 'monospace',
    }}>
      <GameCanvas />
    </div>
  );
};

// Komponen untuk kanvas game Kaboom.js
const GameCanvas = () => {
  const canvasRef = useRef(null);
  const kaboomInstance = useRef(null);
  const footstepSynthRef = useRef(null);
  const interactSynthRef = useRef(null);

  useEffect(() => {
    if (kaboomInstance.current) return;

    // Memuat skrip Tone.js secara dinamis untuk efek suara
    const toneScript = document.createElement("script");
    toneScript.src = "https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js";
    toneScript.async = true;
    document.head.appendChild(toneScript);

    const k = kaboom({
      background: [20, 20, 20],
      width: window.innerWidth,
      height: window.innerHeight,
      canvas: canvasRef.current,
      font: "monospace",
      scale: 1,
    });

    kaboomInstance.current = k;

    // Menyesuaikan ukuran kanvas saat ukuran jendela berubah
    window.addEventListener('resize', () => {
      k.canvas.width = window.innerWidth;
      k.canvas.height = window.innerHeight;
    });

    toneScript.onload = () => {
      const Tone = window.Tone;
      // Menginisialisasi synthesizer untuk efek suara
      footstepSynthRef.current = new Tone.MembraneSynth({
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0,
          release: 0.1,
        },
      }).toDestination();
      interactSynthRef.current = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0,
          release: 0.2
        }
      }).toDestination();

      // Memuat semua sprite yang tersedia di folder 'sprites'
      k.loadSprite("house", "/sprites/house.png");
      k.loadSprite("lab", "/sprites/lab.png");
      k.loadSprite("computer", "/sprites/computer.png");
      k.loadSprite("mailbox", "/sprites/mailbox.png");
      k.loadSprite("grass", "/sprites/grass.png");
      k.loadSprite("tree", "/sprites/tree2-final.png"); 
      k.loadSprite("player", "/sprites/player.png", {
        sliceX: 4,
        sliceY: 4,
        anims: {
          "idle-down": 0, "walk-down": { from: 0, to: 3, speed: 10, loop: true },
          "idle-right": 4, "walk-right": { from: 4, to: 7, speed: 10, loop: true },
          "idle-up": 8, "walk-up": { from: 8, to: 11, speed: 10, loop: true },
          "idle-left": 12, "walk-left": { from: 12, to: 15, speed: 10, loop: true },
        },
      });

      k.scene("title", () => {
        k.add([
          k.text("Kaboom Portfolio", { size: 64, letterSpacing: 2 }),
          k.pos(k.center().x, k.center().y - 100),
          k.anchor("center"),
          k.color(255, 255, 255),
        ]);
        k.add([
          k.text("Tekan tombol apa saja untuk memulai", { size: 24 }),
          k.pos(k.center().x, k.center().y + 50),
          k.anchor("center"),
          k.color(150, 255, 150),
        ]);
        k.onKeyPress(() => { k.go("main"); });
        k.onClick(() => { k.go("main"); });
      });

      k.scene("main", () => {
        const TILE_SIZE = 64;
        const MAP_WIDTH = 25;
        const MAP_HEIGHT = 15;
        let currentAnim = "idle-down";
        let isPaused = false;
        let currentInteract = null;
        let interactLabel = null;
        let footstepCooldown = false;
        let messageBox = null;
        
        // Menggambar peta rumput sebagai latar belakang
        for (let y = 0; y < MAP_HEIGHT; y++) {
          for (let x = 0; x < MAP_WIDTH; x++) {
            k.add([
              k.sprite("grass"),
              k.pos(x * TILE_SIZE, y * TILE_SIZE),
              k.scale(TILE_SIZE / 32),
              k.z(-1),
            ]);
          }
        }

        // Objek-objek interaktif utama
        const interactiveObjects = [
          { sprite: "house", x: 4, y: 4, w: 3, h: 3, tag: "about_area" },
          { sprite: "lab", x: 18, y: 4, w: 5, h: 4, tag: "skills_area" },
          { sprite: "computer", x: 10, y: 10, w: 1, h: 1, tag: "projects_area" },
          { sprite: "mailbox", x: 15, y: 10, w: 1, h: 1, tag: "contact_area" },
        ];

        interactiveObjects.forEach(obj => {
          k.add([
            k.sprite(obj.sprite),
            k.pos(obj.x * TILE_SIZE, obj.y * TILE_SIZE),
            k.scale(obj.w, obj.h),
            k.area(),
            k.z(0),
            k.body({ isStatic: true }),
            obj.tag,
          ]);
        });
        
        // Menambahkan beberapa pohon sebagai dekorasi
        const trees = [
          { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 },
          { x: 13, y: 2 }, { x: 14, y: 2 },
          { x: 23, y: 2 }, { x: 23, y: 3 }, { x: 22, y: 2 },
          { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 },
          { x: 16, y: 13 }, { x: 17, y: 13 },
        ];

        trees.forEach(tree => {
          k.add([
            k.sprite("tree"),
            k.pos(tree.x * TILE_SIZE, tree.y * TILE_SIZE),
            k.scale(TILE_SIZE / 32),
            k.area(),
            k.body({ isStatic: true }),
            k.z(0),
            "tree",
          ]);
        });

        const player = k.add([
          k.sprite("player"),
          k.pos(12 * TILE_SIZE, 8 * TILE_SIZE),
          k.area({ scale: 0.5 }),
          k.body(),
          k.z(1),
          "player",
        ]);
        player.play(currentAnim);

        k.onUpdate(() => {
          const px = player.pos.x;
          const py = player.pos.y;
          const screenW = k.width();
          const screenH = k.height();
          const mapW = MAP_WIDTH * TILE_SIZE;
          const mapH = MAP_HEIGHT * TILE_SIZE;

          const camX = Math.max(screenW / 2, Math.min(px, mapW - screenW / 2));
          const camY = Math.max(screenH / 2, Math.min(py, mapH - screenH / 2));
          k.camPos(camX, camY);

          if (interactLabel) {
            interactLabel.pos.x = k.camPos().x;
            interactLabel.pos.y = k.camPos().y + k.height() / 2 - 30;
          }
          if (messageBox) {
            messageBox.pos = k.camPos();
          }
        });

        let moveSpeed = 200;
        const playFootstep = () => {
          if (!footstepCooldown && footstepSynthRef.current) {
            footstepCooldown = true;
            window.Tone.start();
            footstepSynthRef.current.triggerAttackRelease("C2", "16n", window.Tone.now(), Math.random() * 0.5 + 0.5);
            setTimeout(() => (footstepCooldown = false), 200);
          }
        };
        
        k.onKeyPress("shift", () => { moveSpeed = 400; });
        k.onKeyRelease("shift", () => { moveSpeed = 200; });

        k.onUpdate(() => {
          if (isPaused) return;
          let moved = false;
          let newAnim = currentAnim;
          if (k.isKeyDown("left") || k.isKeyDown("a")) {
            player.move(-moveSpeed, 0);
            newAnim = "walk-left";
            moved = true;
          } else if (k.isKeyDown("right") || k.isKeyDown("d")) {
            player.move(moveSpeed, 0);
            newAnim = "walk-right";
            moved = true;
          } else if (k.isKeyDown("up") || k.isKeyDown("w")) {
            player.move(0, -moveSpeed);
            newAnim = "walk-up";
            moved = true;
          } else if (k.isKeyDown("down") || k.isKeyDown("s")) {
            player.move(0, moveSpeed);
            newAnim = "walk-down";
            moved = true;
          }
          if (moved) {
            if (newAnim !== currentAnim) {
              player.play(newAnim);
              currentAnim = newAnim;
            }
            playFootstep();
          } else if (currentAnim.startsWith("walk")) {
            currentAnim = currentAnim.replace("walk", "idle");
            player.play(currentAnim);
          }
        });

        const showDialog = (title, content, extraButton = null) => {
          interactSynthRef.current.triggerAttackRelease("C4", "8n");
          isPaused = true;
          const boxW = 700;
          const boxH = extraButton ? 450 : 400;

          const box = k.add([
            k.rect(boxW, boxH, { radius: 16 }),
            k.pos(k.camPos()),
            k.anchor("center"),
            k.color(25, 25, 25),
            k.area(),
            k.z(10),
            "dialog_box",
            k.outline(4, k.rgb(100, 255, 100)),
          ]);
          k.add([
            k.text(title, { size: 32 }),
            k.pos(k.camPos().x, k.camPos().y - boxH / 2 + 50),
            k.anchor("center"),
            k.color(255, 255, 0),
            k.z(11),
            "dialog_box",
          ]);

          let contentY = k.camPos().y - boxH / 2 + 100;
          if (Array.isArray(content)) {
            content.forEach(line => {
              k.add([
                k.text(line.text, { size: 16, width: boxW - 100 }),
                k.pos(k.camPos().x, contentY),
                k.anchor("center"),
                k.color(255, 255, 255),
                k.z(11),
                "dialog_box",
              ]);
              if (line.link) {
                const linkText = k.add([
                  k.text("Link", { size: 16, font: "monospace", color: k.rgb(100, 150, 255), }),
                  k.pos(k.camPos().x + (boxW - 100)/2 - 20, contentY + 20),
                  k.anchor("right"),
                  k.area(),
                  "dialog_box",
                  "link-button",
                  { link: line.link }
                ]);
                k.onClick("link-button", (linkBtn) => { window.open(linkBtn.link, "_blank"); });
              }
              contentY += 50;
            });
          } else {
            k.add([
              k.text(content, { size: 16, width: boxW - 100 }),
              k.pos(k.camPos().x, k.camPos().y - boxH / 2 + 150),
              k.anchor("center"),
              k.color(255, 255, 255),
              k.z(11),
              "dialog_box",
            ]);
          }

          const closeBtn = k.add([
            k.rect(150, 40, { radius: 8 }),
            k.pos(k.camPos().x, k.camPos().y + boxH / 2 - 50),
            k.anchor("center"),
            k.color(150, 50, 50),
            k.area(),
            k.z(11),
            "dialog_box",
            "close_button",
          ]);
          k.add([
            k.text("Tutup", { size: 16 }),
            k.pos(k.camPos().x, k.camPos().y + boxH / 2 - 50),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(12),
            "dialog_box",
          ]);
          k.onClick("close_button", () => {
            k.destroyAll("dialog_box");
            isPaused = false;
          });

          if (extraButton) {
            const btn = k.add([
              k.rect(200, 40, { radius: 8 }),
              k.pos(k.camPos().x, k.camPos().y + boxH / 2 - 100),
              k.anchor("center"),
              k.color(0, 150, 255),
              k.area(),
              k.z(11),
              extraButton.tag,
              "dialog_box",
            ]);
            k.add([
              k.text(extraButton.text, { size: 16 }),
              k.pos(k.camPos().x, k.camPos().y + boxH / 2 - 100),
              k.anchor("center"),
              k.color(255, 255, 255),
              k.z(12),
              extraButton.tag,
              "dialog_box",
            ]);
            k.onClick(extraButton.tag, () => { extraButton.action?.(); });
          }

          k.onKeyPress("escape", () => {
            k.destroyAll("dialog_box");
            isPaused = false;
          });
        };

        const showMessage = (msg, duration = 2) => {
          if (messageBox) { messageBox.destroy(); }
          messageBox = k.add([
            k.text(msg, { size: 18, align: "center", width: 400 }),
            k.pos(k.camPos()),
            k.anchor("center"),
            k.color(0, 200, 0),
            k.z(100),
            k.lifespan(duration),
            "message_box",
          ]);
        };

        const copyTextToClipboard = (text) => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
              showMessage("Email disalin ke clipboard!");
            }).catch(err => {
              console.error('Could not copy text: ', err);
              showMessage("Gagal menyalin. Coba lagi.");
            });
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
              document.execCommand('copy');
              showMessage("Email disalin ke clipboard!");
            } catch (err) {
              console.error('Fallback: Could not copy text: ', err);
              showMessage("Gagal menyalin. Coba lagi.");
            }
            document.body.removeChild(textarea);
          }
        };

        const setInteractPrompt = (tag, message) => {
          interactLabel?.destroy();
          interactLabel = k.add([
            k.text(message, { size: 16 }),
            k.pos(k.camPos().x, k.camPos().y + k.height() / 2 - 30),
            k.anchor("center"),
            k.color(255, 255, 255),
            k.z(5),
            "interact_label",
          ]);
          currentInteract = { tag };
        };










/ 
        const clearInteractPrompt = () => {
          currentInteract = null;
          interactLabel?.destroy();
          interactLabel = null;
        };

        k.onCollide("player", "about_area", () => setInteractPrompt("about_area", "Tekan 'E' untuk melihat TENTANG SAYA"));
        k.onCollideEnd("player", "about_area", clearInteractPrompt);
        k.onCollide("player", "skills_area", () => setInteractPrompt("skills_area", "Tekan 'E' untuk melihat KEMAMPUAN"));
        k.onCollideEnd("player", "skills_area", clearInteractPrompt);
        k.onCollide("player", "projects_area", () => setInteractPrompt("projects_area", "Tekan 'E' untuk melihat PROYEK"));
        k.onCollideEnd("player", "projects_area", clearInteractPrompt);
        k.onCollide("player", "contact_area", () => setInteractPrompt("contact_area", "Tekan 'E' untuk melihat KONTAK"));
        k.onCollideEnd("player", "contact_area", clearInteractPrompt);
        k.onCollide("player", "barrel", () => setInteractPrompt("barrel", "Tekan 'E' untuk melihat isi tong"));
        k.onCollideEnd("player", "barrel", clearInteractPrompt);

        k.onKeyPress("e", () => {
          if (!currentInteract || isPaused) return;
          switch (currentInteract.tag) {
            case "about_area":
              showDialog("TENTANG SAYA", portfolioData.bio);
              break;
            case "skills_area":
              const skillsContent = portfolioData.skills.map(s => ({ text: `- ${s.name}: ${s.level}` }));
              showDialog("KEMAMPUAN", skillsContent);
              break;
            case "projects_area":
              const projectsContent = portfolioData.projects.map(p => ({ text: p.name, link: p.githubLink }));
              showDialog("PROYEK", projectsContent);
              break;
            case "contact_area":
              showDialog(
                "KONTAK",
                [{ text: `Email: ${portfolioData.contact.email}` }, { text: `LinkedIn: ${portfolioData.contact.linkedin}`, link: portfolioData.contact.linkedin }, { text: `GitHub: ${portfolioData.contact.github}`, link: portfolioData.contact.github }], 
                { text: "Salin Email", tag: "copy_button", action: () => copyTextToClipboard(portfolioData.contact.email) }
              );
              break;
            case "barrel":
              showDialog("TONG KAYU", "Ini adalah tong kayu biasa. Tidak ada hal menarik di sini.");
              break;
          }
        });
      });

      k.go("title");
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default App;
