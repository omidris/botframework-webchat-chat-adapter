import Observable from 'core-js/features/observable';

enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSED = 2
}

type IterateActivitiesOptions = {
  signal?: AbortSignal;
};

type AdapterConfig = { [key: string]: AdapterConfigValue };
type AdapterConfigValue = boolean | number | string | any;

type SealedAdapter<TActivity, TAdapterConfig extends AdapterConfig> = {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  close: () => void;
  egress: EgressFunction<TActivity>;
  ingress: IngressFunction<TActivity>;
  readyState: ReadyState;
  subscribe: SubscribeFunction<TActivity>;
} & EventTarget &
  TAdapterConfig;

interface Adapter<TActivity, TAdapterConfig extends AdapterConfig> extends EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  close: () => void;
  egress: EgressFunction<TActivity>;
  getConfig: GetConfigFunction<TAdapterConfig>;
  getReadyState: () => ReadyState;
  ingress: IngressFunction<TActivity>;
  setConfig: SetConfigFunction<TAdapterConfig>;
  setReadyState: (readyState: ReadyState) => void;
  subscribe: SubscribeFunction<TActivity>;
}

interface MiddlewareAPI<TActivity, TAdapterConfig extends AdapterConfig> {
  close: () => void;
  egress: EgressFunction<TActivity>;
  getConfig: GetConfigFunction<TAdapterConfig>;
  getReadyState: () => ReadyState;
  ingress: IngressFunction<TActivity>;
  setConfig: SetConfigFunction<TAdapterConfig>;
  setReadyState: (readyState: ReadyState) => void;
  subscribe: SubscribeFunction<TActivity>;
}

type EgressOptions<TActivity> = {
  progress: (activity: TActivity) => void;
};

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void> | void;
type GetConfigFunction<TAdapterConfig> = (key: keyof TAdapterConfig) => AdapterConfigValue;
type IngressFunction<TActivity> = (activity: TActivity) => void;
type SetConfigFunction<TAdapterConfig> = (key: keyof TAdapterConfig, value: AdapterConfigValue) => void;
type SubscribeFunction<TActivity> = (observable: Observable<TActivity> | false) => void;

type AdapterCreator<TActivity, TAdapterConfig extends AdapterConfig> = (
  options?: AdapterOptions
) => Adapter<TActivity, TAdapterConfig>;

type AdapterEnhancer<TActivity, TAdapterConfig extends AdapterConfig> = (
  next: AdapterCreator<TActivity, TAdapterConfig>
) => AdapterCreator<TActivity, TAdapterConfig>;

// type AdapterEnhancer<TInputActivity, TOutputActivity, TAdapterConfig extends AdapterConfig> = (
//   next: AdapterCreator<TInputActivity, TAdapterConfig>
// ) => AdapterCreator<TOutputActivity, TAdapterConfig>;

interface AdapterOptions {}

export type {
  Adapter,
  AdapterConfig,
  AdapterConfigValue,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  EgressFunction,
  EgressOptions,
  GetConfigFunction,
  IngressFunction,
  IterateActivitiesOptions,
  MiddlewareAPI,
  SealedAdapter,
  SetConfigFunction,
  SubscribeFunction
};

export { ReadyState };
