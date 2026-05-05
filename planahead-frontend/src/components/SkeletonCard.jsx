import styles from './SkeletonCard.module.css';

function SkeletonCard({ height = '80px', width = '100%', borderRadius = '8px' }) {
  return (
    <div
      className={styles.skeleton}
      style={{
        borderRadius,
        height,
        width,
      }}
    />
  );
}

export default SkeletonCard;
