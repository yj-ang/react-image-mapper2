import React, { FC } from 'react';
declare type AreaMouseEvent = Event | React.MouseEvent<HTMLAreaElement, MouseEvent>;
export declare type AreaEvent = {
    area: Area;
    index: number;
    event: AreaMouseEvent;
};
export declare type Area = {
    _id?: string;
    shape: 'rect' | 'circle' | 'poly';
    coords: number[];
    href?: string;
    name?: string;
    preFillColor?: string;
    lineWidth?: number;
    strokeColor?: string;
    fillColor?: string;
    center?: number[];
};
export declare type Map = {
    name: string;
    areas: Area[];
};
export interface ImageMapperProps {
    src: string;
    map: Map;
    fillColor?: string;
    strokeColor?: string;
    lineWidth?: number;
    width?: number;
    height?: number;
    active?: boolean;
    imgWidth?: number;
    onLoad?: () => void;
    onClick?: (area: Area, index: number, event: AreaMouseEvent) => void;
    onMouseEnter?: (area: Area, index: number, event: AreaMouseEvent) => void;
    onMouseLeave?: (area: Area, index: number, event: AreaMouseEvent) => void;
    onMouseMove?: (area: Area, index: number, event: AreaMouseEvent) => void;
    onImageClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
    onImageMouseMove?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}
export declare const ImageMapper: FC<ImageMapperProps>;
export {};
