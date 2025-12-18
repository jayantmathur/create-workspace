"use client";

import {
  HTMLAttributes,
  ReactNode,
  useRef,
  useMemo,
  useState,
  MutableRefObject,
} from "react";
import { Canvas, PerspectiveCameraProps } from "@react-three/fiber";
import {
  Preload,
  CameraControls,
  View as ViewImpl,
  Stage,
  PerspectiveCamera,
} from "@react-three/drei";

import { cn } from "@/lib/utils";

type ViewProps = HTMLAttributes<HTMLDivElement> & {
  orbit?: boolean;
  camera?: PerspectiveCameraProps;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const View = ({
  children,
  className,
  orbit = false,
  camera = undefined,
  ...props
}: ViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<CameraControls>(null);

  const [isMounted, setMounted] = useState(false);

  let timeout: NodeJS.Timeout | undefined = undefined;

  const handleActive = () => {
    if (!timeout) return;
    // console.log("active");
    clearTimeout(timeout);
    timeout = undefined;
  };

  const handleInActive = () => {
    if (timeout) return;
    timeout = setTimeout(() => controlsRef?.current?.reset(true), 3000);
    // console.log("inactive");
  };

  useMemo(async () => {
    await sleep(500);
    setMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ViewImpl
      ref={ref}
      track={ref as MutableRefObject<HTMLElement>}
      className={cn(
        "relative w-full h-full pointer-events-auto touch-auto",
        className,
      )}
      onPointerDown={handleActive}
      onPointerUp={handleInActive}
      onPointerLeave={handleInActive}
      onTouchStart={handleActive}
      // onTouchMove={handleActive}
      onTouchEnd={handleInActive}
      {...props}
    >
      <Stage adjustCamera={false}>
        <PerspectiveCamera
          makeDefault
          position={[2, 2, 2]}
          zoom={1}
          {...camera}
        />
        {children}
        <CameraControls
          ref={controlsRef}
          enabled={orbit}
          minDistance={2}
          maxDistance={5}
          // minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.125}
          // minAzimuthAngle={-Math.PI / 4}
          // maxAzimuthAngle={Math.PI / 4}
          onStart={handleActive}
          onEnd={handleInActive}
        />
      </Stage>
    </ViewImpl>
  );
};

const Provider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<any>();
  return (
    <>
      {children}
      <div ref={ref}>
        <Canvas
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
          eventSource={ref}
          dpr={[1, 2]}
        >
          <Preload all />
          <ViewImpl.Port />
        </Canvas>
      </div>
    </>
  );
};

export default Provider;
export type { ViewProps };
export { View };
