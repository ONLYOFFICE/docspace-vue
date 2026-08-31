/*
* (c) Copyright Ascensio System SIA 2026
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { render } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SDKInstance } from "@onlyoffice/docspace-sdk-js/dist/types/instance";
import type { TFrameConfig } from "@onlyoffice/docspace-sdk-js/dist/types/types";

import { DocSpace } from "../src";

const { initFrame, destroyFrame } = vi.hoisted(() => ({
  initFrame: vi.fn(),
  destroyFrame: vi.fn(),
}));

vi.mock("@onlyoffice/docspace-sdk-js", () => ({
  default: class SDK {
    initFrame = initFrame;
  },
}));

const instance = { destroyFrame } as unknown as SDKInstance;

const config: TFrameConfig = {
  frameId: "ds-frame",
  src: "https://portal.example.com",
  mode: "manager",
};

beforeEach(() => {
  vi.clearAllMocks();
  initFrame.mockReturnValue(instance);
});

describe("DocSpace", () => {
  it("renders the element the SDK mounts the frame into", () => {
    render(DocSpace, { props: { config } });

    expect(document.getElementById("ds-frame")).toBeInTheDocument();
  });

  it("sizes the wrapper from the config", () => {
    const { container } = render(DocSpace, {
      props: { config: { ...config, width: "480px", height: "600px" } },
    });

    expect(container.firstChild).toHaveStyle({ width: "480px", height: "600px" });
  });

  it("falls back to filling its parent when no size is given", () => {
    const { container } = render(DocSpace, { props: { config } });

    expect(container.firstChild).toHaveStyle({ width: "100%", height: "100%" });
  });

  it("initialises the frame once, with the given config", () => {
    render(DocSpace, { props: { config } });

    expect(initFrame).toHaveBeenCalledTimes(1);
    expect(initFrame).toHaveBeenCalledWith(config);
  });

  it("hands the instance to the set-docspace-instance listener", () => {
    const { emitted } = render(DocSpace, { props: { config } });

    expect(emitted("setDocspaceInstance")).toStrictEqual([[instance]]);
  });

  it("renders without a listener", () => {
    expect(() => render(DocSpace, { props: { config } })).not.toThrow();
    expect(initFrame).toHaveBeenCalledTimes(1);
  });

  it("does not re-initialise when the config changes", async () => {
    const { rerender } = render(DocSpace, { props: { config } });

    await rerender({ config: { ...config, src: "https://other.example.com" } });

    expect(initFrame).toHaveBeenCalledTimes(1);
    expect(destroyFrame).not.toHaveBeenCalled();
  });

  it("destroys the frame on unmount", () => {
    const { unmount } = render(DocSpace, { props: { config } });

    unmount();

    expect(destroyFrame).toHaveBeenCalledTimes(1);
  });
});
