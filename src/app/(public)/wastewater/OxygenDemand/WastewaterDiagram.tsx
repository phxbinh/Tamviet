'use client';

import React from 'react';

type ArrowProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const Arrow = ({ x1, y1, x2, y2 }: ArrowProps) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="#111"
    strokeWidth="2"
    markerEnd="url(#arrow)"
  />
);

type PolyArrowProps = {
  points: string;
};

const PolyArrow = ({ points }: PolyArrowProps) => (
  <polyline
    points={points}
    fill="none"
    stroke="#111"
    strokeWidth="2"
    markerEnd="url(#arrow)"
  />
);

type ClarifierProps = {
  x: number;
  y: number;
  title: string;
};

const Clarifier = ({
  x,
  y,
  title,
}: ClarifierProps) => {
  const w = 90;
  const h = 92;

  return (
    <g>
      {/* Tank */}
      <path
        d={`
          M ${x} ${y}
          L ${x + w} ${y}
          L ${x + w} ${y + 34}
          L ${x + w / 2} ${y + h}
          L ${x} ${y + 34}
          Z
        `}
        fill="white"
        stroke="#111"
        strokeWidth="2"
      />

      {/* Water level */}
      <line
        x1={x + 4}
        y1={180}
        x2={x + w - 4}
        y2={180}
        stroke="#666"
        strokeWidth="1.5"
      />

      {/* Sludge line */}
      <Arrow
        x1={x + w / 2}
        y1={y + h}
        x2={x + w / 2}
        y2={y + h + 28}
      />

      <text
        x={x + w / 2}
        y={y + h + 46}
        textAnchor="middle"
        fontSize="13"
      >
        Sludge
      </text>

      {/* Title */}
      <text
        x={x + w / 2}
        y={y - 18}
        textAnchor="middle"
        fontSize="13"
      >
        {title}
      </text>
    </g>
  );
};

type AerationTankProps = {
  x: number;
  y: number;
};

const AerationTank = ({
  x,
  y,
}: AerationTankProps) => {
  const w = 150;
  const h = 80;

  return (
    <g>
      {/* Tank */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="white"
        stroke="#111"
        strokeWidth="2"
      />

      {/* Water level */}
      <line
        x1={x + 4}
        y1={180}
        x2={x + w - 4}
        y2={180}
        stroke="#666"
        strokeWidth="1.5"
      />

      {/* Air pipe */}
      <path
        d={`
          M ${x + 20} ${y - 42}
          L ${x + 20} ${y + h - 10}
          L ${x + w - 20} ${y + h - 10}
        `}
        fill="none"
        stroke="#111"
        strokeWidth="2"
      />

      <text
        x={x + 6}
        y={y - 48}
        fontSize="13"
      >
        Air
      </text>

      {/* Diffuser */}
      <line
        x1={x + 28}
        y1={y + h - 10}
        x2={x + w - 28}
        y2={y + h - 10}
        stroke="#111"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Circulation */}
      <path
        d={`
          M ${x + 72} ${y + 35}
          a 24 24 0 1 1 -1 0
        `}
        fill="none"
        stroke="#111"
        strokeWidth="2"
      />

      <polygon
        points={`
          ${x + 92},${y + 30}
          ${x + 84},${y + 31}
          ${x + 89},${y + 37}
        `}
        fill="#111"
      />

      <text
        x={x + 16}
        y={y + h + 24}
        fontSize="13"
      >
        Nitrification tank
      </text>
    </g>
  );
};

type DenitrificationProps = {
  x: number;
  y: number;
};

const DenitrificationTank = ({
  x,
  y,
}: DenitrificationProps) => {
  const w = 175;
  const h = 80;

  return (
    <g>
      {/* Tank */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="white"
        stroke="#111"
        strokeWidth="2"
      />

      {/* Water level */}
      <line
        x1={x + 4}
        y1={180}
        x2={x + w - 4}
        y2={180}
        stroke="#666"
        strokeWidth="1.5"
      />

      {/* Hanging baffle */}
      <line
        x1={x + 110}
        y1={y}
        x2={x + 110}
        y2={y + h - 18}
        stroke="#111"
        strokeWidth="2"
      />

      {/* Mixer */}
      <line
        x1={x + 54}
        y1={y - 20}
        x2={x + 54}
        y2={y + 50}
        stroke="#111"
        strokeWidth="2"
      />

      <ellipse
        cx={x + 54}
        cy={y + 50}
        rx={14}
        ry={5}
        fill="none"
        stroke="#111"
        strokeWidth="2"
      />

      {/* Rotation */}
      <path
        d={`
          M ${x + 48} ${y - 26}
          a 10 10 0 1 1 1 0
        `}
        fill="none"
        stroke="#111"
        strokeWidth="2"
      />

      <polygon
        points={`
          ${x + 63},${y - 18}
          ${x + 56},${y - 18}
          ${x + 60},${y - 12}
        `}
        fill="#111"
      />

      <text
        x={x + 34}
        y={y - 30}
        fontSize="13"
      >
        Mixer
      </text>

      {/* Air */}
      <path
        d={`
          M ${x + 128} ${y - 42}
          L ${x + 128} ${y + h - 10}
          L ${x + w - 10} ${y + h - 10}
        `}
        fill="none"
        stroke="#111"
        strokeWidth="2"
      />

      <text
        x={x + 116}
        y={y - 48}
        fontSize="13"
      >
        Air
      </text>

      {/* Bubbles */}
      <circle cx={x + 140} cy={y + 52} r={2.5} fill="none" stroke="#111" />
      <circle cx={x + 145} cy={y + 40} r={2.5} fill="none" stroke="#111" />
      <circle cx={x + 150} cy={y + 28} r={2.5} fill="none" stroke="#111" />
      <circle cx={x + 156} cy={y + 18} r={2.5} fill="none" stroke="#111" />

      <text
        x={x + 14}
        y={y + h + 24}
        fontSize="13"
      >
        Denitrification tank
      </text>
    </g>
  );
};

const WastewaterDiagram = () => {
  const FLOW_Y = 202;

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        background: '#fff',
        padding: 24,
      }}
    >
      <svg
        width="1200"
        height="420"
        viewBox="0 0 1200 420"
        style={{
          width: '100%',
          height: 'auto',
          background: '#fff',
          border: '1px solid #ddd',
        }}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill="#111"
            />
          </marker>
        </defs>

        {/* PRIMARY */}
        <Clarifier
          x={90}
          y={160}
          title="Primary clarifier"
        />

        <Arrow
          x1={20}
          y1={FLOW_Y}
          x2={90}
          y2={FLOW_Y}
        />

        <text
          x={24}
          y={188}
          fontWeight="bold"
          fontSize="13"
        >
          Influent
        </text>

        {/* NITRIFICATION */}
        <AerationTank
          x={280}
          y={160}
        />

        <Arrow
          x1={180}
          y1={FLOW_Y}
          x2={280}
          y2={FLOW_Y}
        />

        {/* NITRIFICATION CLARIFIER */}
        <Clarifier
          x={500}
          y={160}
          title="Nitrification clarifier"
        />

        <Arrow
          x1={430}
          y1={FLOW_Y}
          x2={500}
          y2={FLOW_Y}
        />

        {/* DENITRIFICATION */}
        <DenitrificationTank
          x={670}
          y={160}
        />

        <Arrow
          x1={590}
          y1={FLOW_Y}
          x2={670}
          y2={FLOW_Y}
        />

        {/* Methanol */}
        <Arrow
          x1={630}
          y1={105}
          x2={630}
          y2={FLOW_Y}
        />

        <text
          x={596}
          y={95}
          fontSize="13"
        >
          Methanol
        </text>

        {/* SECONDARY */}
        <Clarifier
          x={930}
          y={160}
          title="Secondary clarifier"
        />

        <Arrow
          x1={845}
          y1={FLOW_Y}
          x2={930}
          y2={FLOW_Y}
        />

        <Arrow
          x1={1020}
          y1={FLOW_Y}
          x2={1110}
          y2={FLOW_Y}
        />

        <text
          x={1030}
          y={188}
          fontWeight="bold"
          fontSize="13"
        >
          Effluent
        </text>

        {/* RAS 1 */}
        <PolyArrow
          points="
            545,280
            545,320
            210,320
            210,202
          "
        />

        <text
          x={280}
          y={338}
          fontSize="12"
        >
          Return activated sludge
        </text>

        {/* RAS 2 */}
        <PolyArrow
          points="
            975,280
            975,355
            610,355
            610,202
          "
        />

        <text
          x={720}
          y={374}
          fontSize="12"
        >
          Return activated sludge
        </text>

        {/* Figure label */}
        <text
          x={36}
          y={385}
          fontSize="16"
        >
          (c)
        </text>
      </svg>
    </div>
  );
};

export default WastewaterDiagram;