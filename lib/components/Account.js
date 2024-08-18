export async function getAccountInfo(bot) {
  let friendNumber = NaN, groupNumber = NaN
  try {
    friendNumber = (await bot.GetFriendList()).length
  } catch (error) {
    /** 推测适配器未适配GetFriendList方法 */
  }
  try {
    groupNumber = (await bot.GetGroupList()).length
  } catch (error) {
    /** 推测适配器未适配GetGroupList方法 */
  }
  return {
    key: 'Account',
    value: `${friendNumber} Friends & ${groupNumber} Groups`
  }
}

