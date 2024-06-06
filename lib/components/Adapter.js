export async function getAdapter(bot) {
    const { app_name, version } = bot.version || { app_name: '未知', version: '' }
    return {
        key: 'Adapter',
        value: `${app_name} ${version}`
    }
}
