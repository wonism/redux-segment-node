export default function setId(obj, { userId, anonymousId }) {
  if (userId) {
    return {
      ...obj,
      userId,
      anonymousId,
    };
  }

  return {
    ...obj,
    anonymousId,
  };
}
