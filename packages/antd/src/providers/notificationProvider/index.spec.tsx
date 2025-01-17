import React from "react";
import { OpenNotificationParams } from "@refinedev/core";
import { renderHook, waitFor } from "@testing-library/react";
import { notification, App } from "antd";
import { UndoableNotification } from "@components/undoableNotification";
import { act } from "@test";
import { notificationProvider, useNotificationProvider } from ".";

const mockNotification: OpenNotificationParams = {
    key: "test-notification",
    message: "Test Notification Message",
    type: "success",
};

const cancelMutation = jest.fn();

describe("Antd notificationProvider", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const notificationOpenSpy = jest.spyOn(notification, "open");
    const notificationCloseSpy = jest.spyOn(notification, "destroy");

    it("should render notification type succes notification", async () => {
        notificationProvider.open?.(mockNotification);

        expect(notificationOpenSpy).toBeCalledTimes(1);
        expect(notificationOpenSpy).toBeCalledWith({
            ...mockNotification,
            message: null,
            description: mockNotification.message,
        });
    });

    it("should render notification type error notification", async () => {
        notificationProvider.open?.({
            ...mockNotification,
            type: "error",
        });

        expect(notificationOpenSpy).toBeCalledTimes(1);
        expect(notificationOpenSpy).toBeCalledWith({
            ...mockNotification,
            message: null,
            description: mockNotification.message,
            type: "error",
        });
    });

    it("should render notification with description", async () => {
        notificationProvider.open?.({
            ...mockNotification,
            description: "Notification Description",
        });

        expect(notificationOpenSpy).toBeCalledTimes(1);
        expect(notificationOpenSpy).toBeCalledWith({
            ...mockNotification,
            message: "Notification Description",
            description: "Test Notification Message",
        });
    });

    it("should render notification type error notification", async () => {
        notificationProvider.open?.({
            ...mockNotification,
            type: "progress",
            cancelMutation,
            undoableTimeout: 5,
        });

        expect(notificationOpenSpy).toBeCalledTimes(1);
        expect(notificationOpenSpy).toBeCalledWith({
            key: "test-notification",
            message: null,
            closeIcon: <React.Fragment />,
            description: (
                <UndoableNotification
                    message="Test Notification Message"
                    notificationKey="test-notification"
                    cancelMutation={cancelMutation}
                    undoableTimeout={5}
                />
            ),
            duration: 0,
        });
    });

    it("should close notification", async () => {
        notificationProvider.close?.("notification-key");

        expect(notificationCloseSpy).toBeCalledTimes(1);
        expect(notificationCloseSpy).toBeCalledWith("notification-key");
    });
});

describe("Antd useNotificationProvider", () => {
    describe("using without Ant design's App component", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const notificationOpenSpy = jest.spyOn(notification, "open");
        const notificationCloseSpy = jest.spyOn(notification, "destroy");

        it("should render notification type succes notification", async () => {
            const { result } = renderHook(() => useNotificationProvider(), {});

            result.current.open?.(mockNotification);

            expect(notificationOpenSpy).toBeCalledTimes(1);
            expect(notificationOpenSpy).toBeCalledWith({
                ...mockNotification,
                message: null,
                description: mockNotification.message,
            });
        });

        it("should render notification type error notification", async () => {
            const { result } = renderHook(() => useNotificationProvider(), {});

            result.current.open?.({
                ...mockNotification,
                type: "error",
            });

            expect(notificationOpenSpy).toBeCalledTimes(1);
            expect(notificationOpenSpy).toBeCalledWith({
                ...mockNotification,
                message: null,
                description: mockNotification.message,
                type: "error",
            });
        });

        it("should render notification with description", async () => {
            const { result } = renderHook(() => useNotificationProvider(), {});

            result.current.open?.({
                ...mockNotification,
                description: "Notification Description",
            });

            expect(notificationOpenSpy).toBeCalledTimes(1);
            expect(notificationOpenSpy).toBeCalledWith({
                ...mockNotification,
                message: "Notification Description",
                description: "Test Notification Message",
            });
        });

        it("should render notification type error notification", async () => {
            const { result } = renderHook(() => useNotificationProvider(), {});

            result.current.open?.({
                ...mockNotification,
                type: "progress",
                cancelMutation,
                undoableTimeout: 5,
            });

            expect(notificationOpenSpy).toBeCalledTimes(1);
            expect(notificationOpenSpy).toBeCalledWith({
                key: "test-notification",
                message: null,
                closeIcon: <React.Fragment />,
                description: (
                    <UndoableNotification
                        message="Test Notification Message"
                        notificationKey="test-notification"
                        cancelMutation={cancelMutation}
                        undoableTimeout={5}
                    />
                ),
                duration: 0,
            });
        });

        it("should close notification", async () => {
            const { result } = renderHook(() => useNotificationProvider(), {});

            result.current.close?.("notification-key");

            expect(notificationCloseSpy).toBeCalledTimes(1);
            expect(notificationCloseSpy).toBeCalledWith("notification-key");
        });
    });

    describe("using with Ant design's App component", () => {
        const openFn = jest.fn();
        const destroyFn = jest.fn();

        beforeAll(() => {
            jest.spyOn(App, "useApp").mockReturnValue({
                notification: {
                    open: openFn,
                    destroy: destroyFn,
                },
            } as unknown as ReturnType<typeof App.useApp>);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should render notification type succes notification", async () => {
            const { result } = renderHook(() => useNotificationProvider());

            act(() => {
                result.current.open?.(mockNotification);
            });

            await waitFor(() => {
                expect(openFn).toBeCalledTimes(1);
                expect(openFn).toBeCalledWith({
                    ...mockNotification,
                    message: null,
                    description: mockNotification.message,
                });
            });
        });

        it("should render notification type error notification", async () => {
            const { result } = renderHook(() => useNotificationProvider());

            act(() => {
                result.current.open?.({
                    ...mockNotification,
                    type: "error",
                });
            });

            await waitFor(() => {
                expect(openFn).toBeCalledTimes(1);
                expect(openFn).toBeCalledWith({
                    ...mockNotification,
                    message: null,
                    description: mockNotification.message,
                    type: "error",
                });
            });
        });

        it("should render notification with description", async () => {
            const { result } = renderHook(() => useNotificationProvider());

            act(() => {
                result.current.open?.({
                    ...mockNotification,
                    description: "Notification Description",
                });
            });

            await waitFor(() => {
                expect(openFn).toBeCalledTimes(1);
                expect(openFn).toBeCalledWith({
                    ...mockNotification,
                    message: "Notification Description",
                    description: "Test Notification Message",
                });
            });
        });

        it("should render notification type error notification", async () => {
            const { result } = renderHook(() => useNotificationProvider());

            act(() => {
                result.current.open?.({
                    ...mockNotification,
                    type: "progress",
                    cancelMutation,
                    undoableTimeout: 5,
                });
            });

            await waitFor(() => {
                expect(openFn).toBeCalledTimes(1);
                expect(openFn).toBeCalledWith({
                    key: "test-notification",
                    message: null,
                    closeIcon: <React.Fragment />,
                    description: (
                        <UndoableNotification
                            message="Test Notification Message"
                            notificationKey="test-notification"
                            cancelMutation={cancelMutation}
                            undoableTimeout={5}
                        />
                    ),
                    duration: 0,
                });
            });
        });

        it("should close notification", async () => {
            const { result } = renderHook(() => useNotificationProvider());

            act(() => {
                result.current.close?.("notification-key");
            });

            await waitFor(() => {
                expect(destroyFn).toBeCalledTimes(1);
                expect(destroyFn).toBeCalledWith("notification-key");
            });
        });
    });
});
