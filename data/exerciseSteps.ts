import type { ExerciseStep } from '../components/ExerciseAnimator';

export const EXERCISE_STEPS: Record<string, ExerciseStep[]> = {

  // ── Tai Chi ──────────────────────────────────────────────────────────────────

  wujiStance: [
    { title: 'Find Your Position', cue: 'Stand with feet shoulder-width apart, toes pointing slightly outward. Knees very slightly bent — never locked.', emoji: '🧍', breathe: 'natural' },
    { title: 'Soften & Root', cue: 'Let your arms hang naturally. Relax your shoulders down and back. Imagine roots growing from your feet deep into the earth.', emoji: '🌳', breathe: 'inhale' },
    { title: 'Lengthen the Spine', cue: 'Gently tuck your chin slightly. Imagine a golden thread pulling the crown of your head upward. Your spine lengthens naturally.', emoji: '⬆️', breathe: 'exhale' },
    { title: 'Stillness & Breath', cue: 'Close your eyes or soften your gaze. Breathe deep into the belly. Feel each breath slow your heartbeat. Stay here 30–60 seconds.', emoji: '🧘', breathe: 'natural' },
  ],

  taiChiBreathing: [
    { title: 'Hand Placement', cue: 'Place one hand on your belly button, the other on your chest. This helps you feel which part moves first.', emoji: '🙌', breathe: 'natural' },
    { title: 'Belly First', cue: 'Inhale slowly through the nose. Feel your BELLY expand outward first — like filling a balloon from the bottom up. Chest rises last.', emoji: '🫁', breathe: 'inhale' },
    { title: 'Full Exhale', cue: 'Exhale through slightly parted lips. Belly deflates first, then chest falls. Make the exhale twice as long as the inhale.', emoji: '💨', breathe: 'exhale' },
    { title: 'Find the Rhythm', cue: 'In for 4 counts, out for 6–8 counts. After 5 breaths you will feel calmer. This is why Tai Chi masters live so long.', emoji: '🌊', breathe: 'natural' },
  ],

  openingForm: [
    { title: 'Begin in Wuji', cue: 'Stand still, feet shoulder-width, arms at sides. Take one deep breath. This moment of stillness IS part of the form.', emoji: '🧍', breathe: 'natural' },
    { title: 'Raise the Arms', cue: 'As you inhale, slowly float both arms forward and upward to shoulder height. Palms face DOWN. Wrists are loose, elbows slightly soft.', emoji: '🙆', breathe: 'inhale' },
    { title: 'Sink and Lower', cue: 'As you exhale, bend the knees slightly and let the arms float down like leaves settling onto still water. Arrive at the bottom as the breath ends.', emoji: '🧎', breathe: 'exhale' },
    { title: 'Repeat the Flow', cue: 'Repeat 4–6 times. Each repetition is slightly slower and deeper. You are training your body to move with breath, not against it.', emoji: '🔄', breathe: 'natural' },
  ],

  wardOff: [
    { title: 'Hold the Ball', cue: 'Shift weight to the right foot. Bring hands in front of your chest as if holding a large beach ball — right hand on top (palm down), left below (palm up).', emoji: '⚽', breathe: 'inhale' },
    { title: 'Step and Rise', cue: 'Step your left foot forward. As you shift weight forward, raise your left forearm in an arc to shoulder height, palm facing inward — as if gently pushing someone away.', emoji: '🛡️', breathe: 'exhale' },
    { title: 'Root and Hold', cue: 'Your right hand rests at hip level, palm down. Feel the ward-off energy rising through your left arm. Hold for a breath — feel the connection from foot to hand.', emoji: '💪', breathe: 'hold' },
    { title: 'Mirror on Right Side', cue: 'Shift weight back, bring hands to hold the ball again (left on top), step right foot forward, raise the right forearm. Each side equally.', emoji: '🔄', breathe: 'natural' },
  ],

  brushKnee: [
    { title: 'Prepare — Hold the Ball', cue: 'Shift weight right, hold imaginary ball with right hand on top. Left foot takes a small step back to prepare.', emoji: '⚽', breathe: 'inhale' },
    { title: 'Step Forward', cue: 'Step your left foot forward, heel first. As you step, your left hand sweeps DOWN and PAST your left knee — like brushing it clean.', emoji: '🦵', breathe: 'natural' },
    { title: 'Push Forward', cue: 'Shift your weight forward onto the left foot. Simultaneously your right hand PUSHES forward from beside your right ear. Palm faces forward, fingers up.', emoji: '🤚', breathe: 'exhale' },
    { title: 'Repeat on Other Side', cue: 'Now step right foot forward. Right hand brushes past right knee. Left hand pushes from left ear. Walk forward slowly, alternating sides, 3–4 steps each direction.', emoji: '🚶', breathe: 'natural' },
  ],

  cloudHands: [
    { title: 'Wide Stance', cue: 'Step feet slightly wider than shoulder-width apart. Bend knees softly. You will shift weight side to side throughout — feet stay planted.', emoji: '🧍', breathe: 'natural' },
    { title: 'Right Circle', cue: 'Shift weight to the RIGHT. Right hand rises in an arc to face level (palm toward you). Left hand lowers to hip level (palm down). Body turns slightly right.', emoji: '☁️', breathe: 'inhale' },
    { title: 'Left Circle', cue: 'Shift weight to the LEFT. Left hand now rises to face level, right hand lowers. Body turns slightly left. Arms move in opposite directions continuously — like clouds parting.', emoji: '🌤️', breathe: 'exhale' },
    { title: 'Step and Flow', cue: 'Add a sideways step with each shift — step left as you shift left, step right as you shift right. Keep moving slowly for 6–8 repetitions each direction.', emoji: '🌊', breathe: 'natural' },
  ],

  partingHorseMane: [
    { title: 'Hold the Ball', cue: 'Weight on right foot. Right hand on top of imaginary ball (palm down) at chest height. Left hand under ball (palm up). Left foot poised to step.', emoji: '⚽', breathe: 'inhale' },
    { title: 'Step and Separate', cue: 'Step left foot forward. AS you shift weight forward — left arm sweeps upward to shoulder height (palm UP, like offering a tray). Right hand presses down to hip level.', emoji: '🌿', breathe: 'exhale' },
    { title: 'Feel the Extension', cue: 'Both arms are fully extended in opposite directions — left up, right down. Feel the diagonal stretch across your body. Weight is 70% on front foot.', emoji: '⬆️', breathe: 'hold' },
    { title: 'Repeat Mirrored', cue: 'Shift weight back, switch ball hold (left on top now), step right foot forward, right arm rises as left arm lowers. Walk forward 3–4 steps each side.', emoji: '🔄', breathe: 'natural' },
  ],

  graspSparrowTail: [
    { title: 'Part 1 — Ward Off', cue: 'Step left foot forward. Raise left forearm to shoulder height, palm inward. Right hand at hip, palm down. Feel energy rising through the left arm.', emoji: '🛡️', breathe: 'inhale' },
    { title: 'Part 2 — Roll Back', cue: 'Shift weight backward onto right foot. Both hands sweep to the LEFT — right hand near left elbow, left hand facing right. Your body turns left as you receive the energy.', emoji: '↩️', breathe: 'exhale' },
    { title: 'Part 3 — Press', cue: 'Shift weight FORWARD. Left forearm remains raised. Press the right palm against the left wrist and push both forward together — as if pressing through water.', emoji: '🤲', breathe: 'inhale' },
    { title: 'Part 4 — Push', cue: 'Pull both hands back to your waist, palms facing forward. Then push FORWARD as weight shifts onto front foot. Exhale through the push. This completes one full sequence.', emoji: '👐', breathe: 'exhale' },
  ],

  singleWhip: [
    { title: 'From Cloud Hands', cue: 'After the last Cloud Hands (weight on right), continue turning right. Shift weight fully onto the right foot. Body faces right.', emoji: '➡️', breathe: 'inhale' },
    { title: 'Form the Hook', cue: 'Right hand forms a "crane\'s beak" — bring all five fingertips together pointing DOWN, wrist bent. This is the "whip" hook. Hold it out to your right at shoulder height.', emoji: '🪝', breathe: 'hold' },
    { title: 'Step Out Left', cue: 'Step your LEFT foot out to the left side, heel first. Now shift weight onto the left foot as your body turns to face left (or slightly left of center).', emoji: '↖️', breathe: 'exhale' },
    { title: 'Open and Complete', cue: 'Left arm sweeps open to the left — elbow slightly bent, palm facing AWAY from you. Both arms are now spread wide: right hook to the right, left open palm to the left. Feel the expansion.', emoji: '🦅', breathe: 'exhale' },
  ],

  closingForm: [
    { title: 'Return to Centre', cue: 'Bring feet together slowly. Let both arms hang at your sides. Weight evenly distributed. Take a breath and feel the practice settle in your body.', emoji: '🧍', breathe: 'natural' },
    { title: 'Raise and Lower', cue: 'Slowly raise both arms to shoulder height as you inhale (same as opening form). Then let them float down as you exhale, knees softening. Repeat 2–3 times.', emoji: '🙆', breathe: 'inhale' },
    { title: 'Return to Wuji', cue: 'Stand in stillness. Feel the difference between before and after your practice. Your energy has moved, your mind has quieted. Honor this moment.', emoji: '🌿', breathe: 'exhale' },
    { title: 'Warm the Kidneys', cue: 'Rub your palms together vigorously until they are warm. Place them on your lower back over the kidney area. Hold for 30 seconds. This ancient practice supports adrenal and kidney health.', emoji: '🙏', breathe: 'natural' },
  ],

  // ── Strength Exercises ───────────────────────────────────────────────────────

  marchInPlace: [
    { title: 'Start Position', cue: 'Stand tall, feet hip-width apart. Shoulders relaxed, chest open. Arms loose at your sides. Take a breath.', emoji: '🧍', breathe: 'natural' },
    { title: 'Lift and Pump', cue: 'Lift your RIGHT knee up toward hip height. Simultaneously swing your LEFT arm forward. Keep your back straight — no leaning.', emoji: '🚶', breathe: 'natural' },
    { title: 'Alternate Smoothly', cue: 'Lower right foot, lift left knee, swing right arm forward. Find a steady walking rhythm. Stay controlled — this is warm-up, not a sprint.', emoji: '🏃', breathe: 'natural' },
    { title: 'Build the Rhythm', cue: 'After 20 seconds, add a little height to the knee lift and swing the arms more. Breathe through the nose if possible. Continue for 60 seconds total.', emoji: '💨', breathe: 'natural' },
  ],

  armCircles: [
    { title: 'Arm Circles — Forward', cue: 'Stand tall, arms out to the sides at shoulder height. Make small circles forward — gradually increase to large circles over 15 seconds.', emoji: '🔄', breathe: 'natural' },
    { title: 'Arm Circles — Backward', cue: 'Reverse direction. Small circles building to large. Feel the shoulder joint warming and loosening. 15 seconds.', emoji: '🔁', breathe: 'natural' },
    { title: 'Hip Circles', cue: 'Hands on hips, feet shoulder-width. Make large slow circles with your hips — like a slow hula hoop. 15 seconds each direction.', emoji: '🕺', breathe: 'natural' },
    { title: 'Wrist & Ankle Rolls', cue: 'Shake out the hands, then rotate each wrist 5 times each direction. Lift one foot and rotate the ankle each direction. Repeat the other side.', emoji: '🖐️', breathe: 'natural' },
  ],

  wallPushUp: [
    { title: 'Hand Placement', cue: 'Stand an arm\'s length from the wall. Place hands flat on the wall at shoulder width and shoulder height. Fingers point upward. Step feet back slightly.', emoji: '🤚', breathe: 'natural' },
    { title: 'Body Alignment', cue: 'Check that your body is a straight line from head to heels. Don\'t let hips sag or stick out. Tighten your core gently — like bracing for a slow punch.', emoji: '📐', breathe: 'inhale' },
    { title: 'Lower with Control', cue: 'Bend elbows to 45° (not flared wide) as you INHALE and lower your chest toward the wall. Move slowly — 2 seconds down.', emoji: '⬇️', breathe: 'inhale' },
    { title: 'Push Back Strong', cue: 'EXHALE and push the wall away from you. Return to start in 1 second. Feel the chest and triceps working. That\'s 1 rep. Aim for 10 with perfect form.', emoji: '💪', breathe: 'exhale' },
  ],

  bodyweightSquat: [
    { title: 'Starting Position', cue: 'Feet shoulder-width apart, toes pointing out about 15–30°. Arms can reach forward for balance or cross over chest.', emoji: '🧍', breathe: 'natural' },
    { title: 'Sit Back and Down', cue: 'Push your hips BACK first (like sitting into a chair behind you), THEN bend the knees. Chest stays tall. Knees track over toes — not caving inward.', emoji: '🪑', breathe: 'inhale' },
    { title: 'Depth Check', cue: 'Go only as low as comfortable — even to a quarter squat is effective. If knees hurt, go shallower. Quality over depth always.', emoji: '📏', breathe: 'hold' },
    { title: 'Drive Up', cue: 'Push through both heels to return to standing. Squeeze glutes at the top. Exhale as you rise. That is 1 rep. Pause at the top for a breath before the next.', emoji: '⬆️', breathe: 'exhale' },
  ],

  gluteKickback: [
    { title: 'Brace at the Wall', cue: 'Stand facing a wall, hands resting lightly on it for balance. Feet hip-width apart. Shift weight to your LEFT foot.', emoji: '🤚', breathe: 'natural' },
    { title: 'Kickback', cue: 'Keeping your right leg straight (or slightly bent), kick it directly BACKWARD and slightly upward. No twisting the hip — keep hips square.', emoji: '🦵', breathe: 'exhale' },
    { title: 'Squeeze at the Top', cue: 'At the highest point, SQUEEZE your right glute hard for 1 second. You should feel the contraction in your buttock, not your lower back.', emoji: '💥', breathe: 'hold' },
    { title: 'Lower with Control', cue: 'Slowly lower the right leg back to the floor. Do all 8 reps on the right side, then switch. Slow and controlled is more effective than fast and sloppy.', emoji: '⬇️', breathe: 'inhale' },
  ],

  slowHighKnees: [
    { title: 'Standing Tall', cue: 'Stand with feet hip-width apart. Relax the shoulders. This is a SLOW version — controlled cardio, not a sprint.', emoji: '🧍', breathe: 'natural' },
    { title: 'Lift Right Knee', cue: 'Raise your RIGHT knee toward hip height. Swing your LEFT arm forward simultaneously. Like marching but with a higher knee lift and more intent.', emoji: '🦵', breathe: 'exhale' },
    { title: 'Alternate Controlled', cue: 'Lower right, raise LEFT knee, swing RIGHT arm. Each lift takes 1 full second. Feel your heart rate rise gently. This is the healthy fat-burn zone.', emoji: '🔄', breathe: 'natural' },
    { title: 'Breathe Through It', cue: 'Breathe in through the nose for 2 steps, out through the nose for 2 steps. If you can\'t keep nasal breathing, slow down. 20 seconds total.', emoji: '💨', breathe: 'natural' },
  ],

  sideStepping: [
    { title: 'Wide Step Right', cue: 'Step your RIGHT foot out to the right — about shoulder-width or wider. Keep toes pointing forward. Weight follows to the right foot.', emoji: '➡️', breathe: 'natural' },
    { title: 'Bring Feet Together', cue: 'Step your LEFT foot to meet the right foot. Tap together. Optionally add a small squat when feet are apart for extra intensity.', emoji: '👣', breathe: 'exhale' },
    { title: 'Step Left', cue: 'Now step LEFT foot out to the left. Weight follows. Then bring right foot to meet it. You are stepping side to side rhythmically.', emoji: '⬅️', breathe: 'inhale' },
    { title: 'Add the Arms', cue: 'Swing both arms in the direction you are stepping — or clap overhead each time feet come together. Keep moving for the full 20–60 seconds.', emoji: '🙌', breathe: 'natural' },
  ],

  torsoTwist: [
    { title: 'Base Position', cue: 'Feet shoulder-width apart, knees slightly soft. Arms extended out to the sides at shoulder height, or hands resting on hips.', emoji: '🧍', breathe: 'natural' },
    { title: 'Rotate Right', cue: 'Keeping hips STILL (or with minimal movement), rotate your upper body to the RIGHT. Look over your right shoulder. Go as far as comfortable.', emoji: '↪️', breathe: 'exhale' },
    { title: 'Return to Centre', cue: 'Rotate back to face forward. Take a breath at centre before going the other way. Do not rush — each rotation should take 2 full seconds.', emoji: '⏮️', breathe: 'inhale' },
    { title: 'Rotate Left', cue: 'Rotate upper body to the LEFT. Look over your left shoulder. Feel the thoracic spine (mid-back) gently mobilising. Repeat for 60 seconds total.', emoji: '↩️', breathe: 'exhale' },
  ],

  deadBug: [
    { title: 'Starting Position', cue: 'Lie flat on your back. Raise BOTH arms straight toward the ceiling. Bring BOTH knees up to 90° (shins parallel to floor). Press lower back INTO the floor.', emoji: '🤸', breathe: 'inhale' },
    { title: 'Lower Opposite Limbs', cue: 'SLOWLY lower your RIGHT arm overhead toward the floor AND your LEFT leg toward the floor simultaneously. Take 3–4 seconds. Keep lower back pressed DOWN throughout.', emoji: '⬇️', breathe: 'exhale' },
    { title: 'Return to Centre', cue: 'Slowly bring both limbs back to start. The moment your lower back lifts — STOP. That is your limit. Never sacrifice lower back contact for more range.', emoji: '↩️', breathe: 'inhale' },
    { title: 'Switch Sides', cue: 'Now lower LEFT arm and RIGHT leg. That is 1 full repetition. Aim for 6 per side. This exercise is incredibly effective — it looks easy but is very powerful for core strength.', emoji: '🔄', breathe: 'exhale' },
  ],

  standingSideCrunch: [
    { title: 'Starting Position', cue: 'Stand with feet shoulder-width apart. Place both hands behind your head, elbows pointing out. Look forward. Core gently engaged.', emoji: '🧍', breathe: 'natural' },
    { title: 'Knee Up and Over', cue: 'Lift your RIGHT knee upward and OUT to the side (not straight forward). Simultaneously bend your RIGHT elbow DOWN toward the rising knee.', emoji: '🦵', breathe: 'exhale' },
    { title: 'Squeeze the Oblique', cue: 'At the top, where elbow and knee almost meet, squeeze your RIGHT side (the oblique — the muscle along the side of your waist). Hold for half a second.', emoji: '💥', breathe: 'hold' },
    { title: 'Return and Alternate', cue: 'Lower right foot, return elbow. Then immediately lift LEFT knee, bend left elbow down to meet it. Alternate 10 reps each side. Standing means no spine compression.', emoji: '🔄', breathe: 'inhale' },
  ],

  stepOutJacks: [
    { title: 'Start Position', cue: 'Stand with feet together, arms at your sides. This is the low-impact version of jumping jacks — same heart-rate benefit, zero joint impact.', emoji: '🧍', breathe: 'natural' },
    { title: 'Step Right Out', cue: 'Step your RIGHT foot out to the right side (not jumping — just stepping) while raising BOTH arms out and overhead. Like a jumping jack but in slow motion.', emoji: '⭐', breathe: 'inhale' },
    { title: 'Return to Centre', cue: 'Step right foot BACK in as arms lower back to your sides. Feet together, arms down.', emoji: '🧍', breathe: 'exhale' },
    { title: 'Step Left Out', cue: 'Now step LEFT foot out to the left while arms go up again. Alternate right and left continuously. Keep a steady rhythm for 20 seconds. Your heart rate will rise safely.', emoji: '⭐', breathe: 'inhale' },
  ],

  inclinePushUp: [
    { title: 'Find Your Surface', cue: 'Place hands on a sturdy counter, table, or bench — NOT a wheeled chair. Hands shoulder-width apart, fingers pointing forward. Step feet back so body is on an angle.', emoji: '🏠', breathe: 'natural' },
    { title: 'Check the Line', cue: 'Your body must be a straight line from head to heels. Pull your belly button gently toward your spine. No sagging hips, no raised backside.', emoji: '📐', breathe: 'inhale' },
    { title: 'Lower Chest Down', cue: 'Bend elbows to about 45° as you INHALE and lower chest toward the surface. Take 2 seconds to descend. Feel the chest stretching at the bottom.', emoji: '⬇️', breathe: 'inhale' },
    { title: 'Push Strong', cue: 'EXHALE and push the surface away. Drive through the chest and triceps back to straight arms. 1 second up. The lower your surface, the harder the exercise.', emoji: '💪', breathe: 'exhale' },
  ],

  reverseLunge: [
    { title: 'Standing Tall', cue: 'Feet hip-width apart. Stand near a wall if needed for balance. Hands on hips or reaching slightly forward. Chest up.', emoji: '🧍', breathe: 'natural' },
    { title: 'Step BACK', cue: 'Take a long step BACKWARD with your RIGHT foot. This is crucial — stepping back (not forward) protects the front knee. Land on the ball of your right foot.', emoji: '↙️', breathe: 'inhale' },
    { title: 'Lower the Back Knee', cue: 'Bend BOTH knees — front knee goes forward over ankle (NOT past toes), back knee lowers toward the floor. Stop 2–3 inches from the floor.', emoji: '🧎', breathe: 'inhale' },
    { title: 'Drive Back Up', cue: 'Push through your LEFT (front) heel to step back foot forward, returning to standing. EXHALE on the way up. That is 1 rep. Alternate legs for 6 each side.', emoji: '⬆️', breathe: 'exhale' },
  ],

  superman: [
    { title: 'Face Down', cue: 'Lie face down on the floor (use a yoga mat or carpet). Arms stretched forward above your head, legs straight. Forehead resting on the floor or turned to one side.', emoji: '🦸', breathe: 'natural' },
    { title: 'Brace and Prepare', cue: 'Gently squeeze your glutes and tighten your core. Take a breath in. You are about to lift, so prepare the muscles first.', emoji: '⚡', breathe: 'inhale' },
    { title: 'Lift Everything', cue: 'Simultaneously lift your ARMS, CHEST, and LEGS slightly off the floor. Hold for 2 seconds. You should feel your lower back, glutes, and upper back ALL working.', emoji: '🕊️', breathe: 'hold' },
    { title: 'Lower with Control', cue: 'Slowly lower back to the floor. Take a breath before the next rep. If you feel lower back pain (not muscle work), reduce the height of the lift. Do 8 reps.', emoji: '⬇️', breathe: 'exhale' },
  ],

  lateralStepTap: [
    { title: 'Slight Squat Stance', cue: 'Begin with a slight bend in the knees — a quarter-squat. Feet shoulder-width. Hands loosely in front of you. You will maintain this squat throughout.', emoji: '🏋️', breathe: 'natural' },
    { title: 'Step Right with Tap', cue: 'Step your RIGHT foot out to the right, then bring your LEFT foot to TAP beside it (not weight-bearing, just a tap). Add a little squat on each step.', emoji: '➡️', breathe: 'exhale' },
    { title: 'Step Left with Tap', cue: 'Step LEFT foot out to the left, tap RIGHT foot in. Keep the squat going. Your hips should be lower than standing height the whole time.', emoji: '⬅️', breathe: 'inhale' },
    { title: 'Add Arm Pumps', cue: 'Pump arms in the direction you step — right arm forward as you step right, left arm forward as you step left. Keep moving continuously for 20 seconds.', emoji: '🤸', breathe: 'natural' },
  ],

  catCow: [
    { title: 'Table Position', cue: 'Come onto hands and knees. Wrists under shoulders, knees under hips. Spine is neutral — parallel to the floor. Take a breath here.', emoji: '🐄', breathe: 'natural' },
    { title: 'Cow — Drop the Belly', cue: 'INHALE and let your belly DROP toward the floor. Lift your head and tailbone upward. Your spine curves downward in the middle. This is Cow pose.', emoji: '🐮', breathe: 'inhale' },
    { title: 'Cat — Round the Back', cue: 'EXHALE and press hands and knees into the floor. Round your spine UP toward the ceiling like a frightened cat. Tuck chin to chest, tuck tailbone under.', emoji: '🐱', breathe: 'exhale' },
    { title: 'Flow Between', cue: 'Smoothly flow between Cow (inhale) and Cat (exhale) with no pause in between. The spine is like a wave. Repeat 8–10 times, getting slower and deeper with each repetition.', emoji: '🌊', breathe: 'natural' },
  ],

  childsPose: [
    { title: 'Kneel and Sit Back', cue: 'From kneeling, sit your hips back toward your heels. Knees can be together (easier) or spread wide (deeper hip stretch). Pause here before moving forward.', emoji: '🧎', breathe: 'exhale' },
    { title: 'Reach Forward', cue: 'Walk your hands forward along the floor, arms stretched out in front. Let your forehead REST on the floor or a folded blanket. Arms extended or alongside your body.', emoji: '🙇', breathe: 'inhale' },
    { title: 'Breathe Into the Back', cue: 'Feel your lower back EXPAND with each inhale — the breath creates space in the spine. With each exhale, allow your body to sink a little heavier into the pose.', emoji: '💨', breathe: 'natural' },
    { title: 'Rest Here', cue: 'Stay for 30–60 seconds. If hips don\'t reach heels, put a pillow between. Child\'s pose decompresses the lumbar spine — it actively undoes damage from hours of sitting.', emoji: '😌', breathe: 'natural' },
  ],

  quadStretch: [
    { title: 'Stand Near the Wall', cue: 'Stand facing a wall, one hand lightly touching it for balance. Feet hip-width apart. Shift weight onto your LEFT foot.', emoji: '🧍', breathe: 'natural' },
    { title: 'Bend and Hold', cue: 'Bend your RIGHT knee and bring the right heel toward your right buttock. Reach back with your RIGHT hand and hold the ankle (or sock if needed).', emoji: '🦵', breathe: 'inhale' },
    { title: 'Knees Together', cue: 'Bring the bent knee alongside — or behind — the standing knee (not out to the side). Stand tall. Feel the stretch along the front of the thigh.', emoji: '📐', breathe: 'exhale' },
    { title: 'Hold 20–30 Seconds', cue: 'Breathe slowly. The stretch should feel like a deep pull, never sharp pain. Switch to the other leg. Tight quad muscles pull on the lower back — this stretch helps considerably.', emoji: '⏱️', breathe: 'natural' },
  ],

  chestOpener: [
    { title: 'Clasp Hands Behind', cue: 'Stand tall. Bring both arms behind your back and interlace your fingers. If that\'s tight, hold a small towel between the hands instead.', emoji: '🧍', breathe: 'natural' },
    { title: 'Squeeze and Lift', cue: 'Squeeze your shoulder blades together and DOWN. Gently lift your clasped hands away from your back as your chest rises. Do NOT lean backward.', emoji: '⬆️', breathe: 'inhale' },
    { title: 'Open the Chest', cue: 'Feel the stretch across the front of your chest (pectoral muscles) and the front of your shoulders. This is the exact opposite of the hunched position most people spend all day in.', emoji: '💪', breathe: 'hold' },
    { title: 'Hold and Breathe', cue: 'Hold for 20–30 seconds, breathing deeply. Each inhale creates more space in the chest. This single stretch done daily can significantly improve posture in weeks.', emoji: '🌬️', breathe: 'natural' },
  ],

  forwardFold: [
    { title: 'Stand and Prepare', cue: 'Feet hip-width apart, toes pointing forward. Micro-bend the knees — never lock them straight. Take a breath in and grow tall.', emoji: '🧍', breathe: 'inhale' },
    { title: 'Hinge from Hips', cue: 'EXHALE and slowly hinge forward from the HIPS (not the waist). Imagine your pelvis tilting forward. Let your arms and head hang heavy toward the floor.', emoji: '⬇️', breathe: 'exhale' },
    { title: 'Let Gravity Work', cue: 'Do not force the stretch. Simply hang like a rag doll. With each exhale, allow your upper body to drop a little lower. Bend knees more if hamstrings are very tight.', emoji: '🌿', breathe: 'exhale' },
    { title: 'Slowly Rise', cue: 'To come up: bend knees, place hands on thighs, and SLOWLY unroll the spine one vertebra at a time from bottom to top. Head comes up last. Stand for a moment before moving.', emoji: '⬆️', breathe: 'inhale' },
  ],

  deepBreathing: [
    { title: 'Find Your Position', cue: 'Stand, sit, or lie down — whatever is most comfortable. Close your eyes or soften your gaze. Place one hand on your belly.', emoji: '🧘', breathe: 'natural' },
    { title: 'Inhale for 4 Counts', cue: 'Breathe IN through the nose for 4 counts. 1-2-3-4. Belly expands. Chest rises. Fill the lungs completely but without strain.', emoji: '⬆️', breathe: 'inhale' },
    { title: 'Hold for 4 Counts', cue: 'HOLD the breath. 1-2-3-4. Lungs full. This brief hold activates the body\'s relaxation response and increases oxygen absorption.', emoji: '⏸️', breathe: 'hold' },
    { title: 'Exhale for 4 Counts', cue: 'Breathe OUT through the nose or mouth for 4 counts. 1-2-3-4. Then hold empty for 4 counts before the next inhale. Repeat 5–8 cycles. Cortisol drops with each cycle.', emoji: '⬇️', breathe: 'exhale' },
  ],
};
