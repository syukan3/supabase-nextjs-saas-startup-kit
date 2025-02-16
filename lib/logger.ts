type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
    level: LogLevel;
    message: string;
    data?: any;
    error?: Error;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    debug(message: string, data?: any) {
        this.log({ level: 'debug', message, data });
    }

    info(message: string, data?: any) {
        this.log({ level: 'info', message, data });
    }

    warn(message: string, data?: any) {
        this.log({ level: 'warn', message, data });
    }

    error(message: string, error?: Error, data?: any) {
        this.log({ level: 'error', message, data, error });
    }

    private log(logMessage: LogMessage) {
        if (this.isDevelopment) {
            this.developmentLog(logMessage);
        } else {
            this.productionLog(logMessage);
        }
    }

    private developmentLog(logMessage: LogMessage) {
        const { level, message, data, error } = logMessage;
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        switch (level) {
            case 'debug':
                console.log(prefix, message, data || '');
                break;
            case 'info':
                console.info(prefix, message, data || '');
                break;
            case 'warn':
                console.warn(prefix, message, data || '');
                break;
            case 'error':
                console.error(prefix, message, error || '', data || '');
                break;
        }
    }

    private productionLog(logMessage: LogMessage) {
        // TODO: 本番環境用のログ管理システム（Sentry、Winstonなど）を統合
        // 現時点では最小限のエラーログのみを出力
        if (logMessage.level === 'error') {
            console.error(logMessage.message, logMessage.error || '', logMessage.data || '');
        }
    }
}

export const logger = new Logger(); 
