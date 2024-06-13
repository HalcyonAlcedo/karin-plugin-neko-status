import { getCpuLoadAndSpeed } from '../../lib/components/CPU.js'
import { getMemoryUsageCircle } from '../../lib/components/Memory.js'
export default async () => {
  const cpu = await getCpuLoadAndSpeed()
  const memory = await getMemoryUsageCircle()
  return {cpu, memory, col: 2}
}
