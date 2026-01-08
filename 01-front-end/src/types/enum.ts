export enum IterationStatus {
  PENDING = 'pending',
  BUILDING = 'building',
  SUCCESS = 'success',
  FAILED = 'failed'
}

const iterationStatusConfig: {
  [key in IterationStatus]: {
    label: string;
    color: string;
    bgColor: string;
  };
} = {
    [IterationStatus.PENDING]: {
      label: '待构建',
      color: '#faad14',
      bgColor: 'rgba(250, 173, 20, 0.1)'
    },
    [IterationStatus.BUILDING]: {
      label: '运行中',
      color: '#1890ff',
      bgColor: 'rgba(24, 144, 255, 0.1)'
    },
    [IterationStatus.SUCCESS]: {
      label: '已完成',
      color: '#52c41a',
      bgColor: 'rgba(82, 196, 26, 0.1)'
    },
    [IterationStatus.FAILED]: {
      label: '已废弃',
      color: '#f5222d',
      bgColor: 'rgba(245, 34, 45, 0.1)'
    }
};

export function getIterationStatusLabel(status: IterationStatus): string {
  return iterationStatusConfig[status]?.label || status;
}

export function getIterationStatusColor(status: IterationStatus): string {
  return iterationStatusConfig[status]?.color || '#8c8c8c';
}

export function getIterationStatusBgColor(status: IterationStatus): string {
  return iterationStatusConfig[status]?.bgColor || 'rgba(140, 140, 140, 0.1)';
}

// 扩展 IterationStatus 枚举，添加静态方法
export namespace IterationStatus {
  export function getLabel(status: IterationStatus): string {
    return getIterationStatusLabel(status);
  }
  
  export function getColor(status: IterationStatus): string {
    return getIterationStatusColor(status);
  }
  
  export function getBgColor(status: IterationStatus): string {
    return getIterationStatusBgColor(status);
  }
}

export enum PipelineStageStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed'
}

const pipelineStageStatusConfig: {
  [key in PipelineStageStatus]: {
    color: string;
  };
} = {
    [PipelineStageStatus.PENDING]: {
      color: '#8c8c8c'
    },
    [PipelineStageStatus.RUNNING]: {
      color: '#1890ff'
    },
    [PipelineStageStatus.SUCCESS]: {
      color: '#52c41a'
    },
    [PipelineStageStatus.FAILED]: {
      color: '#f5222d'
    }
};

export function getPipelineStageStatusColor(status: PipelineStageStatus): string {
  return pipelineStageStatusConfig[status]?.color || '#8c8c8c';
}

// 扩展 PipelineStageStatus 枚举，添加静态方法
export namespace PipelineStageStatus {
  export function getColor(status: PipelineStageStatus): string {
    return getPipelineStageStatusColor(status);
  }
}
