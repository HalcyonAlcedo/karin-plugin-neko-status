export async function getAccountInfo(bot) {
  const friends = await bot.GetFriendList()
  const groups = await bot.GetGroupList()
    const friendNumber = friends.length
    const groupNumber = groups.length
    return {
        key: 'Account',
        value: `${friendNumber} Friends & ${groupNumber} Groups`
    }
}
