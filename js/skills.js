const registry = new Map();

export function registerSkill(skill) {
  if (!skill?.id) throw new Error("A skill id is required.");
  registry.set(skill.id, { ...skill });
  return registry.get(skill.id);
}

export function registerSkills(skills = []) {
  skills.forEach(registerSkill);
  return listSkills();
}

export function getSkill(id) {
  return registry.get(id) || null;
}

export function listSkills() {
  return [...registry.values()].map(skill => ({ ...skill }));
}

export function clearSkills() {
  registry.clear();
}
