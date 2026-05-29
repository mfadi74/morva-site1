export interface Exercise {
  id: string;
  name: string;
  duration: number;
  reps?: number;
  sets?: number;
  instruction: string;
  tip: string;
  youtubeId: string;
  youtubeQuery: string;
  muscleGroups: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
  isFloor: boolean;
  isTaiChi?: boolean;
}

export interface WorkoutSession {
  id: string;
  day: string;
  dayIndex: number; // 0=Sat, 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri
  title: string;
  subtitle: string;
  totalMinutes: number;
  type: 'strength' | 'cardio' | 'mobility' | 'taichi' | 'rest';
  colorStart: string;
  colorEnd: string;
  warmup: Exercise[];
  circuit: Exercise[];
  cooldown: Exercise[];
  rounds: number;
  restBetweenRounds: number;
  caloriesBurn: number;
}

// ─── EXERCISES ────────────────────────────────────────────────────────────────

export const EXERCISES: Record<string, Exercise> = {

  // ── Tai Chi Exercises ──────────────────────────────────────────────────────

  wujiStance: {
    id: 'wujiStance',
    name: 'Wuji Standing Meditation',
    duration: 60,
    instruction: 'Stand with feet shoulder-width apart, knees very slightly bent, spine tall. Let arms hang naturally at sides. Close eyes or soften gaze. Breathe deeply into the belly. Feel your feet rooted to the ground.',
    tip: 'Wuji ("emptiness") is the foundation of all Tai Chi. Even 60 seconds of this posture calms the nervous system and improves balance.',
    youtubeId: 'cEzJmMoLCcE',
    youtubeQuery: 'wuji standing meditation tai chi beginners',
    muscleGroups: ['balance', 'core', 'mind-body'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  taiChiBreathing: {
    id: 'taiChiBreathing',
    name: 'Tai Chi Belly Breathing',
    duration: 60,
    instruction: 'Stand or sit comfortably. Place one hand on your belly, one on your chest. Inhale slowly through the nose — belly expands first, then chest. Exhale fully through the mouth. Each breath takes 6–8 seconds.',
    tip: 'Belly breathing activates the parasympathetic nervous system, lowering cortisol — the belly-fat hormone. This is medicine for men over 50.',
    youtubeId: 'YFdEq9iekZk',
    youtubeQuery: 'tai chi belly breathing diaphragm beginners',
    muscleGroups: ['diaphragm', 'mind-body'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  openingForm: {
    id: 'openingForm',
    name: 'Tai Chi Opening Form',
    duration: 45,
    instruction: 'Stand in Wuji. Slowly raise both arms in front of you to shoulder height, palms down, as you inhale. Lower arms gently as you exhale, bending knees slightly. Repeat 4–6 times in complete sync with your breath.',
    tip: 'This movement sets the tone for your practice. Move slower than feels natural — in Tai Chi, slower is stronger.',
    youtubeId: 'pA7NTp3OcGI',
    youtubeQuery: 'tai chi opening form commencing form beginners',
    muscleGroups: ['shoulders', 'balance', 'mind-body'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  wardOff: {
    id: 'wardOff',
    name: 'Ward Off (Peng)',
    duration: 60,
    instruction: 'Stand with left foot forward. Raise your left arm in a gentle arc in front of your chest, forearm horizontal, palm facing inward — like you are holding a large ball. Shift weight forward. Repeat on right side. Move slowly, coordinating with breath.',
    tip: 'Ward Off is Tai Chi\'s most fundamental movement. It teaches you to root energy upward through the body — essential for posture and balance in daily life.',
    youtubeId: 'LPfUyaFGCXQ',
    youtubeQuery: 'ward off peng tai chi beginners step by step',
    muscleGroups: ['shoulders', 'legs', 'balance', 'mind-body'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  brushKnee: {
    id: 'brushKnee',
    name: 'Brush Knee and Push',
    duration: 60,
    instruction: 'Step forward with your left foot. As you step, sweep your left hand down past your left knee (brushing it), while your right hand pushes forward from ear level. Shift weight forward as you push. Step right foot forward and repeat on the other side.',
    tip: 'This move trains the body to coordinate opposite arm and leg — crucial for preventing falls. Take tiny steps if needed; safety first.',
    youtubeId: 'q3Q3AgnLCGM',
    youtubeQuery: 'brush knee push tai chi beginners tutorial',
    muscleGroups: ['legs', 'shoulders', 'core', 'balance'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  cloudHands: {
    id: 'cloudHands',
    name: 'Cloud Hands (Wave Hands)',
    duration: 60,
    instruction: 'Stand with feet shoulder-width apart, slightly wider. Shift weight to the right while right hand rises to face level (palm in) and left hand lowers to hip (palm down). Then shift left and reverse arms in a continuous flowing circle. Step the feet side to side slowly.',
    tip: 'Cloud Hands is one of Tai Chi\'s most therapeutic movements — it gently mobilizes the spine, shoulders, and hips all at once while training weight-shifting for balance.',
    youtubeId: 'mgmt8jk1WgQ',
    youtubeQuery: 'cloud hands tai chi wave hands beginners',
    muscleGroups: ['shoulders', 'waist', 'hips', 'balance', 'mind-body'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  partingHorseMane: {
    id: 'partingHorseMane',
    name: "Parting Wild Horse's Mane",
    duration: 60,
    instruction: 'Hold an imaginary ball in front of your chest — right hand on top, left below. Step forward with left foot, left arm sweeps up to shoulder height (palm up), right hand pushes down to hip (palm down). Shift weight forward. Step right foot and repeat mirrored.',
    tip: 'This movement beautifully trains upper-lower body separation — a key Tai Chi principle that improves spine health and overall coordination.',
    youtubeId: 'JT4FvWDCGUs',
    youtubeQuery: "parting wild horse mane tai chi beginners",
    muscleGroups: ['arms', 'legs', 'core', 'balance'],
    difficulty: 'moderate',
    isFloor: false,
    isTaiChi: true,
  },

  graspSparrowTail: {
    id: 'graspSparrowTail',
    name: "Grasp the Sparrow's Tail",
    duration: 90,
    instruction: 'A 4-part sequence: (1) Ward Off — raise forearm like holding a ball. (2) Roll Back — shift weight back, hands sweep left. (3) Press — shift forward, hands press outward. (4) Push — pull hands back to waist, then push forward. Move like water — no breaks between parts.',
    tip: 'This sequence is the heart of Yang-style Tai Chi. Practice each part slowly until smooth, then flow them together. It takes weeks to perfect — enjoy the journey.',
    youtubeId: 'bYHqhCaE8nU',
    youtubeQuery: "grasp sparrow's tail tai chi yang style beginners",
    muscleGroups: ['full body', 'balance', 'coordination', 'mind-body'],
    difficulty: 'moderate',
    isFloor: false,
    isTaiChi: true,
  },

  singleWhip: {
    id: 'singleWhip',
    name: 'Single Whip',
    duration: 60,
    instruction: 'From Cloud Hands, shift weight right. Right hand forms a "hook" (fingertips pinched, wrist bent down). Left arm sweeps open to the left at shoulder height, palm out, as you step left foot out and shift weight left. Your body faces left, arms open wide.',
    tip: 'Single Whip opens the chest, stretches the shoulders, and trains single-leg balance — three benefits in one elegant movement.',
    youtubeId: 'S8IKxCvvqgY',
    youtubeQuery: 'single whip tai chi beginners yang style',
    muscleGroups: ['shoulders', 'chest', 'balance', 'mind-body'],
    difficulty: 'moderate',
    isFloor: false,
    isTaiChi: true,
  },

  closingForm: {
    id: 'closingForm',
    name: 'Tai Chi Closing Form',
    duration: 45,
    instruction: 'Shift weight to centre. Bring both feet together. Lower arms slowly from shoulder height to your sides as you exhale. Return to Wuji stance. Take 3 slow deep breaths. Gently rub palms together to warm them, then place on lower back (kidney area) for 30 seconds.',
    tip: 'Never skip the closing — it seals the energy you have cultivated. The kidney warm is a traditional practice that supports adrenal health, important for men over 50.',
    youtubeId: 'tEmt1Znux58',
    youtubeQuery: 'tai chi closing form ending sequence beginners',
    muscleGroups: ['mind-body', 'diaphragm'],
    difficulty: 'easy',
    isFloor: false,
    isTaiChi: true,
  },

  // ── Strength & Cardio Exercises ────────────────────────────────────────────

  marchInPlace: {
    id: 'marchInPlace',
    name: 'March in Place',
    duration: 60,
    instruction: 'Lift knees to hip height alternately while pumping arms naturally. Keep a steady, controlled pace.',
    tip: 'Focus on form over speed — this is your warm-up, not a race.',
    youtubeId: 'rNGPRSKWbTE',
    youtubeQuery: 'march in place warm up seniors',
    muscleGroups: ['legs', 'core'],
    difficulty: 'easy',
    isFloor: false,
  },

  armCircles: {
    id: 'armCircles',
    name: 'Arm & Hip Circles',
    duration: 60,
    instruction: '15 seconds arm circles forward, 15 backward, then 30 seconds slow hip rotations each direction.',
    tip: 'Move gently — you are warming up the joints, not stretching cold muscles.',
    youtubeId: 'IODxDxX7oi4',
    youtubeQuery: 'arm circles hip circles warm up exercise',
    muscleGroups: ['shoulders', 'hips'],
    difficulty: 'easy',
    isFloor: false,
  },

  wallPushUp: {
    id: 'wallPushUp',
    name: 'Wall Push-Up',
    duration: 40,
    reps: 10,
    sets: 3,
    instruction: 'Stand an arm\'s length from a wall. Place hands flat at shoulder width. Lower chest toward wall with elbows at 45°, then push back to start.',
    tip: 'Keep your body in a straight line — don\'t let your hips sag or stick out.',
    youtubeId: 'zCkOHFBgkqI',
    youtubeQuery: 'wall push-up proper form beginners over 50',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    difficulty: 'easy',
    isFloor: false,
  },

  bodyweightSquat: {
    id: 'bodyweightSquat',
    name: 'Bodyweight Squat',
    duration: 40,
    reps: 10,
    sets: 3,
    instruction: 'Feet shoulder-width apart, toes slightly out. Sit back like lowering into a chair. Keep chest up and knees tracking over toes.',
    tip: 'Only go as low as comfortable — even a partial squat is highly effective for beginners.',
    youtubeId: 'aclHkVaku9U',
    youtubeQuery: 'bodyweight squat proper form men over 50',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'easy',
    isFloor: false,
  },

  gluteKickback: {
    id: 'gluteKickback',
    name: 'Standing Glute Kickback',
    duration: 40,
    reps: 8,
    sets: 3,
    instruction: 'Hold a wall for balance. Kick one leg straight back, squeezing your glute at the top. Lower with control. Complete all reps, then switch legs.',
    tip: 'Don\'t lean forward — stay tall to protect your lower back.',
    youtubeId: 'lC7UbVUUdIQ',
    youtubeQuery: 'standing glute kickback exercise beginners',
    muscleGroups: ['glutes', 'hamstrings'],
    difficulty: 'easy',
    isFloor: false,
  },

  slowHighKnees: {
    id: 'slowHighKnees',
    name: 'Slow High Knees',
    duration: 20,
    instruction: 'March in place at a controlled pace, lifting each knee to hip height. Pump arms naturally.',
    tip: 'This is your cardio finisher — keep it controlled, not frantic.',
    youtubeId: 'tx5rgpDAJiA',
    youtubeQuery: 'low impact high knees beginners cardio',
    muscleGroups: ['legs', 'core', 'cardio'],
    difficulty: 'easy',
    isFloor: false,
  },

  sideStepping: {
    id: 'sideStepping',
    name: 'Side Step Touch',
    duration: 60,
    instruction: 'Step right foot out, bring left to meet it, step left foot out, bring right to meet it. Add arm swings for extra calorie burn.',
    tip: 'Add a small squat on each step to boost intensity.',
    youtubeId: 'zLxovOdQFpM',
    youtubeQuery: 'step touch cardio low impact beginners',
    muscleGroups: ['legs', 'cardio'],
    difficulty: 'easy',
    isFloor: false,
  },

  torsoTwist: {
    id: 'torsoTwist',
    name: 'Standing Torso Twist',
    duration: 60,
    instruction: 'Stand with feet shoulder-width apart. With arms extended or hands on hips, rotate your torso side to side in a controlled motion.',
    tip: 'Rotate from the waist — your hips should stay relatively still.',
    youtubeId: 'S8IKxCvvqgY',
    youtubeQuery: 'standing torso rotation warm up exercise',
    muscleGroups: ['core', 'obliques'],
    difficulty: 'easy',
    isFloor: false,
  },

  deadBug: {
    id: 'deadBug',
    name: 'Dead Bug',
    duration: 60,
    reps: 6,
    sets: 3,
    instruction: 'Lie on back, arms pointing up, knees bent 90° above hips. Slowly lower your right arm overhead and left leg toward floor simultaneously. Return and switch sides.',
    tip: 'Press your lower back firmly into the floor throughout — this protects your spine.',
    youtubeId: 'LPfUyaFGCXQ',
    youtubeQuery: 'dead bug exercise core beginners lower back safe',
    muscleGroups: ['core', 'lower back'],
    difficulty: 'easy',
    isFloor: true,
  },

  standingSideCrunch: {
    id: 'standingSideCrunch',
    name: 'Standing Side Crunch',
    duration: 40,
    reps: 10,
    sets: 3,
    instruction: 'Stand with hands behind head. Lift your right knee up and out while bending your right elbow down to meet it. Squeeze your oblique at the top. Alternate sides.',
    tip: 'This targets your waist without any floor pressure on the spine.',
    youtubeId: 'KV6Gk_Ws7hs',
    youtubeQuery: 'standing side crunch oblique exercise beginners',
    muscleGroups: ['obliques', 'core'],
    difficulty: 'easy',
    isFloor: false,
  },

  stepOutJacks: {
    id: 'stepOutJacks',
    name: 'Step-Out Jacks',
    duration: 20,
    instruction: 'Instead of jumping, step one foot out at a time while raising arms overhead, then bring feet back together. Alternate sides continuously.',
    tip: 'Same heart rate benefits as jumping jacks — zero impact on joints.',
    youtubeId: 'iSSAk4XCsRA',
    youtubeQuery: 'low impact jumping jacks step out cardio',
    muscleGroups: ['legs', 'shoulders', 'cardio'],
    difficulty: 'easy',
    isFloor: false,
  },

  inclinePushUp: {
    id: 'inclinePushUp',
    name: 'Incline Push-Up',
    duration: 40,
    reps: 10,
    sets: 3,
    instruction: 'Place hands on a sturdy counter or table edge, shoulder-width apart. Keep body in a straight line and lower chest to the surface, then push back up.',
    tip: 'A lower surface = harder exercise. Use a kitchen counter to start, progress to a lower surface over weeks.',
    youtubeId: 'cfns5KdVp3Y',
    youtubeQuery: 'incline push-up proper form counter table beginners',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    difficulty: 'moderate',
    isFloor: false,
  },

  reverseLunge: {
    id: 'reverseLunge',
    name: 'Reverse Lunge',
    duration: 50,
    reps: 6,
    sets: 3,
    instruction: 'Step one foot backward, lowering your back knee toward the floor. Keep your front knee directly over your ankle. Push through your front heel to return to standing.',
    tip: 'Stepping BACK (not forward) is much gentler on your knees — important for men over 50.',
    youtubeId: 'xrPteyQLGAo',
    youtubeQuery: 'reverse lunge knee friendly beginners over 50',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'moderate',
    isFloor: false,
  },

  superman: {
    id: 'superman',
    name: 'Superman Hold',
    duration: 40,
    reps: 8,
    sets: 3,
    instruction: 'Lie face down with arms stretched forward. Simultaneously lift your arms, chest, and legs slightly off the floor. Hold for 2 seconds at the top, then lower with control.',
    tip: 'One of the best lower back strengtheners — essential for protecting your spine during daily life.',
    youtubeId: 'z6PJMT2y8GQ',
    youtubeQuery: 'superman exercise lower back beginners proper form',
    muscleGroups: ['lower back', 'glutes', 'hamstrings'],
    difficulty: 'easy',
    isFloor: true,
  },

  lateralStepTap: {
    id: 'lateralStepTap',
    name: 'Lateral Step Tap',
    duration: 20,
    instruction: 'Step side to side with a slight squat on each step. Tap the opposite foot to meet the standing leg before stepping back. Add arm swings for intensity.',
    tip: 'Keep your chest up and core tight — don\'t round your back when you squat.',
    youtubeId: 'GdKMtMi7GRE',
    youtubeQuery: 'lateral step touch squat low impact cardio',
    muscleGroups: ['legs', 'glutes', 'cardio'],
    difficulty: 'easy',
    isFloor: false,
  },

  catCow: {
    id: 'catCow',
    name: 'Cat-Cow Stretch',
    duration: 60,
    instruction: 'On hands and knees, arch your back up toward the ceiling (cat), then let it drop toward the floor (cow). Move slowly and breathe with each movement.',
    tip: 'One of the best spine-decompression moves — take your time and breathe deeply.',
    youtubeId: 'kqnua4rHVVA',
    youtubeQuery: 'cat cow stretch back pain relief beginners',
    muscleGroups: ['spine', 'core'],
    difficulty: 'easy',
    isFloor: true,
  },

  childsPose: {
    id: 'childsPose',
    name: "Child's Pose",
    duration: 60,
    instruction: 'Kneel and sit back on your heels, then reach arms forward and lower your forehead to the floor (or a pillow). Breathe deeply and relax completely.',
    tip: 'This position actively decompresses the lumbar spine. Stay here as long as feels good.',
    youtubeId: 'qZ_KaKHgR8A',
    youtubeQuery: "child's pose yoga stretch lower back beginners",
    muscleGroups: ['lower back', 'hips', 'shoulders'],
    difficulty: 'easy',
    isFloor: true,
  },

  quadStretch: {
    id: 'quadStretch',
    name: 'Standing Quad Stretch',
    duration: 60,
    instruction: 'Stand on one leg (use wall for balance), bring your other heel up toward your glutes and hold the ankle. Keep knees together and stand tall.',
    tip: 'Hold the wall with your free hand — balance challenges increase fall risk.',
    youtubeId: 'RFPV1PxEm5w',
    youtubeQuery: 'standing quad stretch seniors balance',
    muscleGroups: ['quads', 'hip flexors'],
    difficulty: 'easy',
    isFloor: false,
  },

  chestOpener: {
    id: 'chestOpener',
    name: 'Standing Chest Opener',
    duration: 30,
    instruction: 'Clasp your hands behind your back. Squeeze your shoulder blades together and lift your chest upward. Hold and breathe deeply.',
    tip: 'Counteracts the forward-hunched posture that comes from sitting at desks or looking at phones.',
    youtubeId: 'ogQLkBk8Hvo',
    youtubeQuery: 'standing chest opener posture stretch desk workers',
    muscleGroups: ['chest', 'shoulders', 'upper back'],
    difficulty: 'easy',
    isFloor: false,
  },

  forwardFold: {
    id: 'forwardFold',
    name: 'Standing Forward Fold',
    duration: 60,
    instruction: 'Stand with feet hip-width apart. Slowly fold forward from the hips, letting your arms hang. Bend knees generously.',
    tip: 'Never force a forward fold — hang heavy and let gravity do the work.',
    youtubeId: '7kgZnJqzNaU',
    youtubeQuery: 'standing forward fold beginner hamstring stretch',
    muscleGroups: ['hamstrings', 'lower back', 'calves'],
    difficulty: 'easy',
    isFloor: false,
  },

  deepBreathing: {
    id: 'deepBreathing',
    name: 'Box Breathing',
    duration: 90,
    instruction: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5–8 cycles.',
    tip: 'This lowers cortisol — the stress hormone that directly contributes to belly fat storage in men over 50.',
    youtubeId: 'tEmt1Znux58',
    youtubeQuery: 'box breathing technique stress reduction cortisol',
    muscleGroups: ['diaphragm'],
    difficulty: 'easy',
    isFloor: false,
  },
};

// ─── WORKOUT SESSIONS (Sat→Fri) ────────────────────────────────────────────────
// dayIndex: 0=Sat, 1=Sun, 2=Mon(rest), 3=Tue, 4=Wed, 5=Thu, 6=Fri(rest)

export const WORKOUT_SESSIONS: WorkoutSession[] = [
  {
    id: 'session1',
    day: 'Saturday',
    dayIndex: 0,
    title: 'Tai Chi Fundamentals',
    subtitle: 'Root, breathe and flow',
    totalMinutes: 15,
    type: 'taichi',
    colorStart: '#7c3aed',
    colorEnd: '#4f46e5',
    rounds: 1,
    restBetweenRounds: 0,
    caloriesBurn: 55,
    warmup: [EXERCISES.wujiStance, EXERCISES.taiChiBreathing],
    circuit: [EXERCISES.openingForm, EXERCISES.wardOff, EXERCISES.brushKnee, EXERCISES.cloudHands],
    cooldown: [EXERCISES.closingForm],
  },
  {
    id: 'session2',
    day: 'Sunday',
    dayIndex: 1,
    title: 'Full Body Strength A',
    subtitle: 'Build foundational strength',
    totalMinutes: 15,
    type: 'strength',
    colorStart: '#4f46e5',
    colorEnd: '#0ea5e9',
    rounds: 3,
    restBetweenRounds: 60,
    caloriesBurn: 85,
    warmup: [EXERCISES.marchInPlace, EXERCISES.armCircles],
    circuit: [EXERCISES.wallPushUp, EXERCISES.bodyweightSquat, EXERCISES.gluteKickback, EXERCISES.slowHighKnees],
    cooldown: [EXERCISES.quadStretch, EXERCISES.chestOpener],
  },
  {
    id: 'session3',
    day: 'Tuesday',
    dayIndex: 3,
    title: 'Cardio & Core Burn',
    subtitle: 'Fire up your metabolism',
    totalMinutes: 15,
    type: 'cardio',
    colorStart: '#00d4aa',
    colorEnd: '#0ea5e9',
    rounds: 3,
    restBetweenRounds: 60,
    caloriesBurn: 110,
    warmup: [EXERCISES.sideStepping, EXERCISES.torsoTwist],
    circuit: [EXERCISES.sideStepping, EXERCISES.deadBug, EXERCISES.standingSideCrunch, EXERCISES.stepOutJacks],
    cooldown: [EXERCISES.catCow, EXERCISES.childsPose],
  },
  {
    id: 'session4',
    day: 'Wednesday',
    dayIndex: 4,
    title: 'Tai Chi Flow & Balance',
    subtitle: 'Deepen your practice',
    totalMinutes: 15,
    type: 'taichi',
    colorStart: '#8b5cf6',
    colorEnd: '#ec4899',
    rounds: 1,
    restBetweenRounds: 0,
    caloriesBurn: 60,
    warmup: [EXERCISES.wujiStance, EXERCISES.openingForm],
    circuit: [EXERCISES.partingHorseMane, EXERCISES.graspSparrowTail, EXERCISES.singleWhip, EXERCISES.cloudHands],
    cooldown: [EXERCISES.forwardFold, EXERCISES.deepBreathing, EXERCISES.closingForm],
  },
  {
    id: 'session5',
    day: 'Thursday',
    dayIndex: 5,
    title: 'Full Body Strength B',
    subtitle: 'Progress and build on week 1',
    totalMinutes: 15,
    type: 'strength',
    colorStart: '#f59e0b',
    colorEnd: '#ef4444',
    rounds: 3,
    restBetweenRounds: 60,
    caloriesBurn: 95,
    warmup: [EXERCISES.marchInPlace, EXERCISES.armCircles],
    circuit: [EXERCISES.inclinePushUp, EXERCISES.reverseLunge, EXERCISES.superman, EXERCISES.lateralStepTap],
    cooldown: [EXERCISES.quadStretch, EXERCISES.catCow],
  },
];

// ─── WEEK SCHEDULE (Sat → Fri) ────────────────────────────────────────────────

export const WEEK_SCHEDULE = [
  { dayIndex: 0, label: 'Sat', sessionId: 'session1', isRest: false },
  { dayIndex: 1, label: 'Sun', sessionId: 'session2', isRest: false },
  { dayIndex: 2, label: 'Mon', sessionId: null,       isRest: true  },
  { dayIndex: 3, label: 'Tue', sessionId: 'session3', isRest: false },
  { dayIndex: 4, label: 'Wed', sessionId: 'session4', isRest: false },
  { dayIndex: 5, label: 'Thu', sessionId: 'session5', isRest: false },
  { dayIndex: 6, label: 'Fri', sessionId: null,       isRest: true  },
];

// Converts JS getDay() (Sun=0) to our Sat-first index (Sat=0)
export function getAdjustedDayIndex(): number {
  const jsDay = new Date().getDay();
  // Sun=0→1, Mon=1→2, Tue=2→3, Wed=3→4, Thu=4→5, Fri=5→6, Sat=6→0
  const map: Record<number, number> = { 0:1, 1:2, 2:3, 3:4, 4:5, 5:6, 6:0 };
  return map[jsDay];
}

export function getTodaySession(): WorkoutSession | null {
  const idx = getAdjustedDayIndex();
  const schedule = WEEK_SCHEDULE.find(s => s.dayIndex === idx);
  if (!schedule || schedule.isRest || !schedule.sessionId) return null;
  return WORKOUT_SESSIONS.find(s => s.id === schedule.sessionId) ?? null;
}
