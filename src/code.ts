figma.showUI(__html__, { width: 300, height: 200 });

// レイヤー名で検索して表示/非表示を設定する関数
async function toggleLayersByName(layerName: string, visible: boolean) {
  // 処理開始を通知
  figma.notify('処理を開始しました...', { timeout: 500 });
  
  // 現在のページ内のすべてのノードを取得
  const nodes = figma.currentPage.findAll(node => node.name === layerName);
  
  // 見つかったノードの表示/非表示を設定
  nodes.forEach(node => {
    node.visible = visible;
  });

  return nodes.length; // 変更されたレイヤーの数を返す
}

// メッセージの型定義
interface PluginMessage {
  type: 'hide-layers' | 'show-layers';
  layerName: string;
}

// UIからのメッセージを処理
figma.ui.onmessage = async (msg: PluginMessage) => {
  const { type, layerName } = msg;
  
  if (!layerName.trim()) {
    figma.notify('レイヤー名を入力してください');
    return;
  }

  try {
    if (type === 'hide-layers') {
      const count = await toggleLayersByName(layerName, false);
      figma.notify(`${layerName}を非表示にしました (${count}個のレイヤー)`);
    } else if (type === 'show-layers') {
      const count = await toggleLayersByName(layerName, true);
      figma.notify(`${layerName}を表示しました (${count}個のレイヤー)`);
    }
  } catch (error) {
    figma.notify('エラーが発生しました');
    console.error(error);
  }

  // 処理完了をUIに通知
  figma.ui.postMessage({ type: 'operation-complete' });
};
