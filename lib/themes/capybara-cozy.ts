import type { Theme } from "./types"

// Cozy capybara personality quiz — the original demo theme.
// Everything that defines this quiz lives in this file: questions, choices,
// scoring tags, archetype profiles + text in every locale, and the mascot
// reference. Swap themes by editing lib/themes/active.ts.
export const theme: Theme = {
  id: "capybara-cozy",
  mascotId: "capy",
  start: "q_intro",
  estimatedDepth: 5,

  tags: ["chill", "social", "adventure", "foodie", "nocturnal", "wise"],

  meta: {
    siteName: {
      en: "Capybara Quiz",
      th: "คาปิบาร่า ควิซ",
    },
    tagline: {
      en: "Float through a story. Discover your inner capybara.",
      th: "ลอยไปกับเรื่องราวเล็กๆ แล้วเจอคาปิบาร่าในตัวคุณ",
    },
    ogTitle: {
      en: "What Capybara Are You? A Cozy 5-Question Personality Quiz",
      th: "คุณเป็นคาปิบาร่าแบบไหน? ควิซบุคลิกแบบอบอุ่นใน 5 คำถามสั้นๆ",
    },
    ogDescription: {
      en: "A non-linear personality quiz with a capybara mascot. Drift through 5 cozy questions and meet your inner capy.",
      th: "ควิซบุคลิกแบบไม่เป็นเส้นตรง พร้อมคาปิบาร่าเป็นมาสคอต ลอยผ่าน 5 คำถามอุ่นๆ แล้วเจอตัวตนคาปิของคุณ",
    },
  },

  archetypes: {
    "zen-master": {
      profile: { chill: 2, wise: 2, nocturnal: -1 },
      accent: "chart-2",
      mascot: { variant: "leaf", expression: "closed" },
      name: { en: "The Zen Master", th: "เซน มาสเตอร์" },
      description: {
        en: "You are stillness on four paws. Storms pass; you keep floating. People drift toward your calm.",
        th: "คุณคือความสงบบนสี่ขา พายุผ่านไป คุณยังลอยอยู่ ผู้คนถูกดึงเข้าหาความนิ่งของคุณ",
      },
      traits: {
        en: ["Calm under pressure", "Quietly wise", "Patient by default"],
        th: ["สงบในยามวุ่น", "ฉลาดอย่างเงียบๆ", "อดทนเป็นค่าเริ่มต้น"],
      },
    },
    "foodie-lounger": {
      profile: { foodie: 3, chill: 1 },
      accent: "chart-3",
      mascot: { variant: "bowl", expression: "happy" },
      name: { en: "The Foodie Lounger", th: "ฟู้ดดี้ ลาวน์เจอร์" },
      description: {
        en: "Life is a series of cozy snacks between excellent naps. You taste the world slowly and on purpose.",
        th: "ชีวิตคือชุดของขนมอุ่นๆ คั่นด้วยการงีบที่ยอดเยี่ยม คุณลิ้มรสโลกอย่างช้าๆ และตั้งใจ",
      },
      traits: {
        en: ["Comfort first", "Connoisseur of small joys", "Always knows the best snack"],
        th: ["สบายไว้ก่อน", "เซียนความสุขเล็กๆ", "รู้เสมอว่าขนมไหนดีที่สุด"],
      },
    },
    "adventure-seeker": {
      profile: { adventure: 3, chill: -1 },
      accent: "chart-4",
      mascot: { variant: "hat", expression: "open" },
      name: { en: "The Adventure Seeker", th: "นักผจญภัย" },
      description: {
        en: "There's a trail, and you've already started walking. Restless, curious, the first one in the river.",
        th: "มีเส้นทางอยู่ และคุณก็เริ่มเดินไปแล้ว อยู่ไม่สุข อยากรู้อยากเห็น เป็นคนแรกที่ลงน้ำเสมอ",
      },
      traits: {
        en: ["Bold and curious", "First to explore", "Loves a good story"],
        th: ["กล้าและสงสัย", "เป็นคนแรกที่สำรวจ", "รักเรื่องเล่าดีๆ"],
      },
    },
    "social-bather": {
      profile: { social: 3, chill: 1 },
      accent: "chart-1",
      mascot: { variant: "towel", expression: "happy" },
      name: { en: "The Social Bather", th: "โซเชียล เบเธอร์" },
      description: {
        en: "The party is wherever you are. You collect friends like warm stones — easy, generous, glowing.",
        th: "ที่ไหนมีคุณ ที่นั่นคือปาร์ตี้ คุณเก็บเพื่อนเหมือนเก็บก้อนหินอุ่นๆ ง่ายๆ ใจกว้าง อบอุ่น",
      },
      traits: {
        en: ["Warm host energy", "Connector of people", "Group hot tub mayor"],
        th: ["พลังเจ้าภาพอบอุ่น", "เชื่อมคนเข้าหากัน", "นายกบ่อน้ำร้อนแห่งกลุ่ม"],
      },
    },
    "lone-floater": {
      profile: { social: -3, chill: 1, wise: 1 },
      accent: "chart-5",
      mascot: { variant: "none", expression: "closed" },
      name: { en: "The Lone Floater", th: "โลน โฟลตเตอร์" },
      description: {
        en: "Solitude is a feature, not a bug. You think best in still water and rarely need an audience.",
        th: "ความสันโดษคือคุณสมบัติ ไม่ใช่ปัญหา คุณคิดได้ดีที่สุดในน้ำนิ่ง และไม่ค่อยต้องการผู้ชม",
      },
      traits: {
        en: ["Independent", "Deep thinker", "Recharges in silence"],
        th: ["พึ่งตัวเอง", "นักคิดลึก", "ชาร์จพลังในความเงียบ"],
      },
    },
    "hot-spring-sage": {
      profile: { wise: 3, chill: 1, social: -1 },
      accent: "chart-2",
      mascot: { variant: "towel", expression: "closed" },
      name: { en: "The Hot Spring Sage", th: "ปราชญ์น้ำพุร้อน" },
      description: {
        en: "Warm water, warmer wisdom. People come to you with tangled thoughts and leave with something clearer.",
        th: "น้ำอุ่น ปัญญาอุ่นกว่า ผู้คนมาหาคุณพร้อมความคิดที่พันกัน และกลับไปพร้อมอะไรที่ชัดขึ้น",
      },
      traits: {
        en: ["Quietly wise", "Soothing presence", "Trusted listener"],
        th: ["ฉลาดอย่างเงียบๆ", "การปรากฏตัวที่ปลอบโยน", "ผู้ฟังที่ไว้ใจได้"],
      },
    },
    sunbather: {
      profile: { chill: 2, foodie: 1, adventure: -1, nocturnal: -1 },
      accent: "chart-1",
      mascot: { variant: "sunglasses", expression: "happy" },
      name: { en: "The Sunbather", th: "ซันเบเธอร์" },
      description: {
        en: "Optimism wrapped in a soft, warm pelt. You find the bright patch and you stay there.",
        th: "ความมองโลกในแง่ดีห่อหุ้มด้วยขนนุ่มอุ่น คุณหาจุดที่แดดส่องและก็อยู่ตรงนั้น",
      },
      traits: {
        en: ["Sunny outlook", "Easygoing", "Brightens the room"],
        th: ["มุมมองสดใส", "ใจเย็น", "ทำให้ห้องสว่างขึ้น"],
      },
    },
    "night-owl": {
      profile: { nocturnal: 3, wise: 1 },
      accent: "chart-5",
      mascot: { variant: "moon", expression: "open" },
      name: { en: "The Night Owl Capy", th: "ไนต์ อาวล์ คาปิ" },
      description: {
        en: "Your best ideas show up after midnight. You make the small hours feel like a private kingdom.",
        th: "ไอเดียดีๆ ของคุณมักโผล่หลังเที่ยงคืน คุณทำให้ชั่วโมงเล็กๆ รู้สึกเหมือนอาณาจักรส่วนตัว",
      },
      traits: {
        en: ["Creative after dark", "Mysterious vibes", "Loves quiet hours"],
        th: ["สร้างสรรค์ตอนกลางคืน", "ไวบ์ลึกลับ", "รักชั่วโมงเงียบๆ"],
      },
    },
  },

  questions: {
    q_intro: {
      prompt: {
        en: "It's a slow afternoon. The water is just right. What pulls you in?",
        th: "บ่ายเอื่อยๆ น้ำกำลังพอดี อะไรดึงคุณเข้าไป?",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "A long, quiet soak — nothing on the schedule.",
            th: "แช่นานๆ เงียบๆ ไม่มีตารางอะไรทั้งวัน",
          },
          tags: { chill: 2, wise: 1 },
          next: "q_morning",
        },
        {
          id: "b",
          label: {
            en: "Wandering somewhere new — let's see what's out there.",
            th: "ออกไปสำรวจที่ใหม่ๆ ดูซิว่ามีอะไรรออยู่",
          },
          tags: { adventure: 2 },
          next: "q_adventure",
        },
        {
          id: "c",
          label: {
            en: "Friends are gathering — the more, the warmer.",
            th: "เพื่อนๆ กำลังมารวมตัว ยิ่งคนเยอะยิ่งอุ่น",
          },
          tags: { social: 2 },
          next: "q_social",
        },
        {
          id: "d",
          label: {
            en: "I'll come alive after the sun goes down.",
            th: "ฉันจะมีชีวิตชีวาตอนพระอาทิตย์ลับฟ้าไปแล้ว",
          },
          tags: { nocturnal: 2 },
          next: "q_night",
        },
      ],
    },

    q_morning: {
      prompt: {
        en: "How does your perfect morning unfold?",
        th: "เช้าในฝันของคุณเป็นยังไง?",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Slowly. Hot bath, deep breaths, no thoughts.",
            th: "ช้าๆ แช่น้ำอุ่น หายใจลึกๆ ไม่คิดอะไรเลย",
          },
          tags: { chill: 2, wise: 1 },
          next: "q_water",
        },
        {
          id: "b",
          label: {
            en: "With a bowl of fruit and good crunchy snacks.",
            th: "ผลไม้หนึ่งชาม กับขนมกรุบกรอบดีๆ",
          },
          tags: { chill: 1, foodie: 2 },
          next: "q_companion",
        },
        {
          id: "c",
          label: {
            en: "A gentle stretch in the sun, no rush.",
            th: "ยืดเส้นเบาๆ ในแสงแดด ไม่รีบ",
          },
          tags: { chill: 1, adventure: 1 },
          next: "q_water",
        },
      ],
    },

    q_adventure: {
      prompt: {
        en: "Where do your paws want to wander?",
        th: "เท้าของคุณอยากพาไปไหน?",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Deep into a misty forest, alone with the trees.",
            th: "เข้าไปในป่าหมอกหนา ลำพังกับต้นไม้",
          },
          tags: { adventure: 2, wise: 1 },
          next: "q_companion",
        },
        {
          id: "b",
          label: {
            en: "Down a fast river — bring the splash.",
            th: "ลงไปในแม่น้ำเชี่ยวๆ ขอให้กระเซ็นเต็มที่",
          },
          tags: { adventure: 2, social: 1 },
          next: "q_water",
        },
        {
          id: "c",
          label: {
            en: "A long mountain trail with one cozy lookout.",
            th: "เส้นทางภูเขายาวๆ กับจุดชมวิวอุ่นๆ หนึ่งจุด",
          },
          tags: { adventure: 1, chill: 1 },
          next: "q_water",
        },
      ],
    },

    q_social: {
      prompt: {
        en: "The gathering is on. What's your role?",
        th: "งานสังสรรค์เริ่มแล้ว คุณคือใคร?",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Host the whole thing — snacks, music, hugs.",
            th: "เจ้าภาพ — ขนม เพลง กอด ครบ",
          },
          tags: { social: 2, foodie: 1 },
          next: "q_companion",
        },
        {
          id: "b",
          label: {
            en: "Quiet corner storyteller, drawing people in.",
            th: "นักเล่าเรื่องในมุมเงียบ ดึงคนเข้าหา",
          },
          tags: { social: 1, wise: 1 },
          next: "q_companion",
        },
        {
          id: "c",
          label: {
            en: "Honestly? I'd rather slip away to the water.",
            th: "พูดตรงๆ ขอแอบไปแช่น้ำดีกว่า",
          },
          tags: { social: -1, chill: 1 },
          next: "q_water",
        },
      ],
    },

    q_night: {
      prompt: {
        en: "Past midnight. The world is asleep. What now?",
        th: "เลยเที่ยงคืน ทุกคนหลับหมดแล้ว ทำอะไรต่อ?",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Stargazing alone, just me and the sky.",
            th: "ดูดาวคนเดียว แค่ฉันกับท้องฟ้า",
          },
          tags: { nocturnal: 1, wise: 1, social: -1 },
          next: "q_water",
        },
        {
          id: "b",
          label: {
            en: "A late, secret snack mission.",
            th: "ภารกิจหาของกินดึกๆ แบบลับๆ",
          },
          tags: { nocturnal: 1, foodie: 2 },
          next: "q_companion",
        },
        {
          id: "c",
          label: {
            en: "Cozy movie marathon under a blanket pile.",
            th: "มาราธอนหนังในกองผ้าห่ม",
          },
          tags: { nocturnal: 2, chill: 1 },
          next: "q_water",
        },
      ],
    },

    q_water: {
      prompt: {
        en: "Pick your water spot.",
        th: "เลือกแหล่งน้ำของคุณ",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Steaming hot spring, eyes closed, mind drifting.",
            th: "บ่อน้ำพุร้อน หลับตา ปล่อยใจล่องลอย",
          },
          tags: { chill: 1, wise: 2 },
          next: "q_food",
        },
        {
          id: "b",
          label: {
            en: "A lazy river — nowhere to be, all day.",
            th: "แม่น้ำที่ไหลเอื่อยๆ ทั้งวันก็ยังได้",
          },
          tags: { chill: 2 },
          next: "q_food",
        },
        {
          id: "c",
          label: {
            en: "A splash zone — friends, laughter, chaos.",
            th: "โซนกระเซ็น — เพื่อน เสียงหัวเราะ ความวุ่นวาย",
          },
          tags: { social: 2, adventure: 1 },
          next: "q_food",
        },
      ],
    },

    q_companion: {
      prompt: {
        en: "Who's around you tonight?",
        th: "คืนนี้ใครอยู่รอบๆ คุณ?",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "A small, trusted circle — the same warm faces.",
            th: "วงเล็กๆ ที่ไว้ใจ หน้าเดิมๆ ที่อบอุ่น",
          },
          tags: { social: 1, wise: 1 },
          next: "q_food",
        },
        {
          id: "b",
          label: {
            en: "Everyone. The more capys, the better.",
            th: "ทุกคนเลย ยิ่งคาปิเยอะยิ่งดี",
          },
          tags: { social: 2 },
          next: "q_food",
        },
        {
          id: "c",
          label: {
            en: "Just me, thanks. Solitude is the snack.",
            th: "ขอคนเดียวพอ ความสงบคือของว่าง",
          },
          tags: { social: -2, chill: 1 },
          next: "q_food",
        },
      ],
    },

    q_food: {
      prompt: {
        en: "Snack situation. Choose carefully.",
        th: "เรื่องของกิน เลือกให้ดีๆ",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Fresh fruit, herbs, a sprig of something green.",
            th: "ผลไม้สด สมุนไพร ใบเขียวๆ สักก้าน",
          },
          tags: { foodie: 1, chill: 1 },
          next: "q_final",
        },
        {
          id: "b",
          label: {
            en: "A warm, hearty bowl of comfort.",
            th: "ชามอุ่นๆ หนักๆ ที่ปลอบใจได้",
          },
          tags: { foodie: 2 },
          next: "q_final",
        },
        {
          id: "c",
          label: {
            en: "A midnight cheese plate, lit by candle.",
            th: "จานชีสยามดึก พร้อมแสงเทียน",
          },
          tags: { foodie: 1, nocturnal: 1 },
          next: "q_final",
        },
        {
          id: "d",
          label: {
            en: "Skip food — more napping, please.",
            th: "ข้ามมื้อนี้ ขอนอนต่ออีกหน่อย",
          },
          tags: { chill: 2 },
          next: "q_final",
        },
      ],
    },

    q_final: {
      prompt: {
        en: "One last decision before the day closes.",
        th: "การตัดสินใจสุดท้ายก่อนวันจะจบ",
      },
      choices: [
        {
          id: "a",
          label: {
            en: "Drift to sleep watching the stars.",
            th: "ค่อยๆ หลับไปพร้อมกับมองดาว",
          },
          tags: { nocturnal: 1, wise: 1 },
          next: null,
        },
        {
          id: "b",
          label: {
            en: "One more shared laugh with friends.",
            th: "เสียงหัวเราะอีกครั้งกับเพื่อน",
          },
          tags: { social: 1 },
          next: null,
        },
        {
          id: "c",
          label: {
            en: "A final reflective soak — alone with thoughts.",
            th: "แช่น้ำเงียบๆ ครั้งสุดท้าย คนเดียวกับความคิด",
          },
          tags: { chill: 1, wise: 1 },
          next: null,
        },
        {
          id: "d",
          label: {
            en: "One more daring dive before bed.",
            th: "กระโดดน้ำกล้าๆ อีกครั้งก่อนนอน",
          },
          tags: { adventure: 1 },
          next: null,
        },
      ],
    },
  },
}
