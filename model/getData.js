import { getCpuLoadAndSpeed, getCpuModel } from "../components/CPU.js"
import { getMemoryUsageCircle } from "../components/Memory.js"
import { getNetworkSpeed } from "../components/Network.js"
import { getDiskUsageCircle } from "../components/Disk.js"
import { getSysInfo } from "../components/System.js"
import { getGpuInfo } from "../components/GPU.js"
import { getPluginNumInfo } from "../components/Plugin.js"
import { getAccountInfo } from "../components/Account.js"
import { getAdapter } from "../components/Adapter.js"
import Version from "../components/Version.js"
import formatTime from "../utils/formatTime.js"
import Config from "../components/Config.js"

export default new class getData {
    async getDashboardData() {
        const [cpu, memory, network, disk] = await Promise.all([
            getCpuLoadAndSpeed(),
            getMemoryUsageCircle(),
            getNetworkSpeed(),
            getDiskUsageCircle()
        ]);
        return {
            cpu,
            memory,
            network,
            disk
        };
    }

    async getInfoData(bot) {
        const [cpu, system, gpu, plugin, adapter, account] = await Promise.all([
            getCpuModel(),
            getSysInfo(),
            getGpuInfo(),
            getPluginNumInfo(),
            getAdapter(bot),
            getAccountInfo(bot)
        ]);
        return {
            cpu,
            system,
            gpu,
            plugin,
            adapter,
            account
        };
    }

    async getData(e) {
        const [dashboardData, infoData] = await Promise.all([
            this.getDashboardData(),
            this.getInfoData(e.bot)
        ]);

        const bot = e.bot || Bot;

        const data = {
            "BotVersion": Version.isMiao ? 'Miao-Yunzai' : Version.isTrss ? 'TRSS-Yunzai' : 'Yunzai',
            "BotAvatar": bot.avatar || await bot.pickFriend(bot.uin).getAvatarUrl?.() || `https://q1.qlogo.cn/g?b=qq&s=0&nk=${bot.uin}`,
            "BotName": bot.nickname.substring(0, 10) || 'Shizuku',
            "HeadImage": await Config.getConfig().headimg_url,
            "Dashboard": dashboardData,
            "Info": infoData,
            "Runtime": formatTime(Date.now() / 1000 - Bot.stat?.start_time, 'Bot已运行dd天hh小时mm分钟', false)
        };

        return data;
    }
}
