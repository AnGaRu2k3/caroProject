

import Board from '@/components/Board'; //
const GamePage = ({params}) => {
  return (
    <div>
      <Board gameId={params} />
    </div>
  );
};

export default GamePage;