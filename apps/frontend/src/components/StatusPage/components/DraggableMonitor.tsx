// components/DraggableMonitor.tsx
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { IMonitor } from '@/types/monitor'

interface DraggableMonitorProps {
  index: number
  monitor: IMonitor
  moveMonitor: (from: number, to: number) => void
  children: React.ReactNode
  type: 'card' | 'line'
}

interface DragItem {
  index: number
  id: string
  type: string
}

const DraggableMonitor = ({ monitor, index, moveMonitor, children, type }: DraggableMonitorProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<DragItem>({
    accept: type,
    hover(item) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveMonitor(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id: monitor.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      {children}
    </div>
  )
}

export default DraggableMonitor
