import { AxiosRequestConfig, AxiosInstance } from 'axios'
import { IAxiosRetryConfig } from 'axios-retry'

interface Props extends AxiosRequestConfig, IAxiosRetryConfig {}

export function createHttpClient(props: Props): AxiosInstance
