export const createMeeting = () => {
  const randomString = Math.random().toString(36).substring(2, 10); // 8 chars
  return `https://meet.jit.si/meeting-${randomString}`;
};
