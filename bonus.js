function canJump(nums) {
  let max = 0;
  const len = nums.length;

  for (let i = 0; i < len; i++) {
    if (i > max) {
      return false;
    }
    max = Math.max(max, i + nums[i]);
    if (max >= len - 1) {
      return true;
    }
  }
  return true; // If the loop completes, you can reach the last index
}
