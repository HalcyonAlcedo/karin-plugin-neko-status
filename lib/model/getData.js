import { Bot, Cfg, common } from 'node-karin'
import { Config } from '#template'
import { getCpuLoadAndSpeed, getCpuModel } from "../components/CPU.js"
import { getMemoryUsageCircle } from "../components/Memory.js"
import { getNetworkSpeed } from "../components/Network.js"
import { getDiskUsageCircle } from "../components/Disk.js"
import { getSysInfo } from "../components/System.js"
import { getGpuInfo } from "../components/GPU.js"
import { getPluginNumInfo } from "../components/Plugin.js"
import { getAccountInfo } from "../components/Account.js"
import { getAdapter } from "../components/Adapter.js"

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
            await getPluginNumInfo(),
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

    async getHeadImage() {
        const url = Config.Config.headimg_url
        try {
            new URL(url);
            let response = await fetch(url)
            const arraybuffer = await response.arrayBuffer()
            let base64 = Buffer.from(arraybuffer).toString('base64')
            return 'data:image/png;base64,' + base64
        } catch (e) {
            return url
        }
    }

    async getData(e) {
        const [dashboardData, infoData] = await Promise.all([
            this.getDashboardData(),
            this.getInfoData(e.bot)
        ]);
        const bot = e.bot || Bot.adapter[0]
        // 机器人头像
        const botAvatar = bot.getAvatarUrl(e.self_id, 0) || `https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.self_id}`

        const data = {
            "BotVersion": `Karin ${Cfg.package.version}`,
            "BotAvatar": botAvatar,
            "BotName": bot.account.name.substring(0, 10) || 'Karin',
            "HeadImage": await this.getHeadImage(),
            "Dashboard": dashboardData,
            "Info": infoData,
            "Runtime": `Bot已运行${common.uptime()}`
        };

        return data;
    }
}
