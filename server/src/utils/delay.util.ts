
export const delay = async (milliseconds: number): Promise<void> => {
  if (milliseconds <= 0) {
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};