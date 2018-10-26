export default function setId(obj, { userId, anonymousId }, mapToPrevious = false) {
  if (mapToPrevious) {
    if (userId) {
      return {
        ...obj,
        previousId: userId,
        anonymousId,
      };
    }

    return {
      ...obj,
      previousId: anonymousId,
    };
  }

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
