import { ComponentType } from "../mod.ts";

export const CircleSvg: ComponentType = {
  name: "CircleSvg",
  html: `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    preserveAspectRatio="xMidYMid
    meet"
    width="1280"
    height="1280"
    viewBox="0 0 1280 1280"
    style="width:100%;height:100%"
  >
    <defs>
      <animateTransform
        repeatCount="indefinite"
        dur="3.003003s"
        begin="0s"
        xlink:href="#_R_G_L_0_G"
        fill="freeze"
        attributeName="transform"
        from="0"
        to="360"
        type="rotate"
        additive="sum"
        keyTimes="0;1"
        values="0;360"
        keySplines="0.167 0.167 0.833 0.833"
        calcMode="spline"
      />
      <animateTransform
        repeatCount="indefinite"
        dur="3.003003s"
        begin="0s"
        xlink:href="#_R_G_L_0_G"
        fill="freeze"
        attributeName="transform"
        from="0.92 0.92"
        to="0.92 0.92"
        type="scale"
        additive="sum"
        keyTimes="0;1"
        values="0.92 0.92;0.92 0.92"
        keySplines="0 0 1 1"
        calcMode="spline"
      />
      <animateTransform
        repeatCount="indefinite"
        dur="3.003003s"
        begin="0s"
        xlink:href="#_R_G_L_0_G"
        fill="freeze"
        attributeName="transform"
        from="-640 -640"
        to="-640 -640"
        type="translate"
        additive="sum"
        keyTimes="0;1"
        values="-640 -640;-640 -640"
        keySplines="0 0 1 1"
        calcMode="spline"
      />
      <animate
        attributeType="XML"
        attributeName="opacity"
        dur="3s"
        from="0"
        to="1"
        xlink:href="#time_group"
      />
    </defs>
    <g id="_R_G">
      <g 
        id="_R_G_L_0_G"
        transform="
        translate(640, 640)"
      >
        <path
          id="_R_G_L_0_G_D_0_P_0"
          fill="#ffffff"
          fill-opacity="0"
          fill-rule="nonzero"
          d=" M0 1280 C0,1280 1280,1280 1280,1280 C1280,1280 1280,0 1280,0 C1280,0 0,0 0,0 C0,0 0,1280 0,1280z "
        />
        <path
          id="_R_G_L_0_G_D_1_P_0"
          stroke="#ebe4ff"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          stroke-width="12"
          stroke-opacity="1"
          d=" M640 8 C989.04,8 1272,290.96 1272,640 C1272,989.04 989.04,1272 640,1272 C290.96,1272 8,989.04 8,640 C8,290.96 290.96,8 640,8z "
        />
        <path
          id="_R_G_L_0_G_D_2_P_0"
          stroke="#673de6"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          stroke-width="12"
          stroke-opacity="1"
          d=" M8 640 C8,989.04 290.96,1272 640,1272 C989.04,1272 1272,989.04 1272,640 C1272,290.96 989.04,8 640,8 "
        />
      </g>
    </g>
    <g id="time_group"/>
  </svg>`
};