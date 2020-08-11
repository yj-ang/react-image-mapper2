import React, { FC, useRef, useEffect } from 'react'

type AreaMouseEvent = Event | React.MouseEvent<HTMLAreaElement, MouseEvent>

export type AreaEvent = {
  area: Area
  index: number
  event: AreaMouseEvent
}

export type Area = {
  _id?: string
  shape: 'rect' | 'circle' | 'poly'
  coords: number[]
  href?: string
  name?: string
  preFillColor?: string
  lineWidth?: number
  strokeColor?: string
  fillColor?: string
  center?: number[]
}

export type Map = {
  name: string
  areas: Area[]
}

export interface ImageMapperProps {
  src: string
  map: Map
  fillColor?: string
  strokeColor?: string
  lineWidth?: number
  width?: number
  height?: number
  active?: boolean
  imgWidth?: number
  onLoad?: () => void
  onClick?: (area: Area, index: number, event: AreaMouseEvent) => void
  onMouseEnter?: (area: Area, index: number, event: AreaMouseEvent) => void
  onMouseLeave?: (area: Area, index: number, event: AreaMouseEvent) => void
  onMouseMove?: (area: Area, index: number, event: AreaMouseEvent) => void
  onImageClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
  onImageMouseMove?: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => void
}

export const ImageMapper: FC<ImageMapperProps> = ({
  src,
  map,
  fillColor = 'rgba(255, 255, 255, 0.5)',
  strokeColor = 'rgba(0, 0, 0, 0.5)',
  lineWidth = 1,
  width,
  height,
  active,
  imgWidth,
  onLoad,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onImageClick,
  onImageMouseMove
}) => {
  const absPos = { position: 'absolute', top: 0, left: 0 }
  const styles: any = {
    container: { position: 'relative' },
    canvas: { ...absPos, pointerEvents: 'none', zIndex: 2 },
    img: { ...absPos, zIndex: 1, userSelect: 'none' },
    map: (onClick && { cursor: 'pointer' }) || undefined
  }
  const img = useRef<HTMLImageElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    initCanvas()
  }, [src, map, fillColor, strokeColor, lineWidth, width, height, active, imgWidth])

  const drawrect = (
    coords: number[],
    fillColor: string,
    lineWidth: number,
    strokeColor: string
  ) => {
    let [left, top, right, bot] = coords
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = fillColor
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor
    ctx.strokeRect(left, top, right - left, bot - top)
    ctx.fillRect(left, top, right - left, bot - top)
    ctx.fillStyle = fillColor
  }

  const drawcircle = (
    coords: number[],
    fillColor: string,
    lineWidth: number,
    strokeColor: string
  ) => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = fillColor
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor
    ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
    ctx.fillStyle = fillColor
  }

  const drawpoly = (
    coords: number[],
    fillColor: string,
    lineWidth: number,
    strokeColor: string
  ) => {
    const coords1: number[][] = coords.reduce(
      (a, _, i, s) => (i % 2 ? a : [...a, s.slice(i, i + 2)]) as any,
      []
    )
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = fillColor
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor
    coords1.forEach(c => ctx.lineTo(c[0], c[1]))
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
    ctx.fillStyle = fillColor
  }

  const initCanvas = () => {
    if (!canvas.current || !img.current || !container.current) {
      return
    }

    if (width) img.current.width = width

    if (height) img.current.height = height

    canvas.current.width = width || img.current.clientWidth
    canvas.current.height = height || img.current.clientHeight
    container.current.style.width = (width || img.current.clientWidth) + 'px'
    container.current.style.height = (height || img.current.clientHeight) + 'px'

    const ctx = canvas.current.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = fillColor

    if (onLoad) onLoad()

    renderPrefilledAreas()
  }

  const hoverOn = ({ area, index, event }: AreaEvent) => {
    const shape = (event.target as HTMLAreaElement)?.getAttribute('shape')

    if (!shape) return

    if (active && ['draw' + shape]) {
      drawArea(area)
    }
    if (onMouseEnter) onMouseEnter(area, index, event)
  }

  const hoverOff = ({ area, index, event }: AreaEvent) => {
    if (active && canvas.current) {
      const ctx = canvas.current?.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
      renderPrefilledAreas()
    }

    if (onMouseLeave) onMouseLeave(area, index, event)
  }

  const click = ({ area, index, event }: AreaEvent) => {
    if (onClick) {
      event.preventDefault()
      onClick(area, index, event)
    }
  }

  const imageClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (onImageClick) {
      event.preventDefault()
      onImageClick(event)
    }
  }

  const mouseMove = ({ area, index, event }: AreaEvent) => {
    if (onMouseMove) {
      onMouseMove(area, index, event)
    }
  }

  const imageMouseMove = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (onImageMouseMove) {
      onImageMouseMove(event)
    }
  }

  const scaleCoords = (coords: number[]) => {
    // calculate scale based on current 'width' and the original 'imgWidth'
    const scale = width && imgWidth && imgWidth > 0 ? width / imgWidth : 1
    return coords.map(coord => coord * scale)
  }

  const renderPrefilledAreas = () => {
    map.areas.map(area => {
      if (!area.preFillColor) return
      drawArea(area)
    })
  }

  const drawArea = (area: Area) => {
    switch (area.shape) {
      case 'rect':
        drawrect(
          scaleCoords(area.coords),
          area.preFillColor || fillColor,
          area.lineWidth || lineWidth,
          area.strokeColor || strokeColor
        )
        break
      case 'circle':
        drawcircle(
          scaleCoords(area.coords),
          area.preFillColor || fillColor,
          area.lineWidth || lineWidth,
          area.strokeColor || strokeColor
        )
        break
      case 'poly':
        drawpoly(
          scaleCoords(area.coords),
          area.preFillColor || fillColor,
          area.lineWidth || lineWidth,
          area.strokeColor || strokeColor
        )
        break
    }
  }

  const computeCenter = (area: Area) => {
    if (!area) return [0, 0]

    const scaledCoords = scaleCoords(area.coords)

    switch (area.shape) {
      case 'circle':
        return [scaledCoords[0], scaledCoords[1]]
      case 'poly':
      case 'rect':
      default: {
        // Calculate centroid
        const n = scaledCoords.length / 2
        const { y, x } = scaledCoords.reduce(
          ({ y, x }, val, idx) => {
            return !(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x }
          },
          { y: 0, x: 0 }
        )
        return [x, y]
      }
    }
  }

  const renderAreas = () => {
    return map.areas.map((area, index) => {
      const scaledCoords = scaleCoords(area.coords)
      const center = computeCenter(area)
      const extendedArea = { ...area, scaledCoords, center }

      return (
        <area
          key={area._id || index}
          shape={area.shape}
          coords={scaledCoords.join(',')}
          onMouseEnter={event =>
            hoverOn({
              area: extendedArea,
              index: index,
              event: event
            })
          }
          onMouseLeave={event =>
            hoverOff({
              area: extendedArea,
              index: index,
              event: event
            })
          }
          onMouseMove={event =>
            mouseMove({
              area: extendedArea,
              index: index,
              event: event
            })
          }
          onClick={event =>
            click({
              area: extendedArea,
              index: index,
              event: event
            })
          }
          href={area.href}
        />
      )
    })
  }

  return (
    <div style={styles.container} ref={container}>
      <img
        style={styles.img}
        src={src}
        useMap={`#${map.name}`}
        alt=''
        ref={img}
        onClick={imageClick}
        onMouseMove={imageMouseMove}
      />
      <canvas ref={canvas} style={styles.canvas} />
      <map name={map.name} style={styles.map}>
        {renderAreas()}
      </map>
    </div>
  )
}
