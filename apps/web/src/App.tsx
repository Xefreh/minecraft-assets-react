import { MinecraftIcon } from '@minecraft-assets/ui';
import {
  diamond,
  diamond_sword,
  diamond_pickaxe,
  diamond_chestplate,
  diamond_helmet,
  diamond_leggings,
  iron_ingot,
  gold_ingot,
  emerald,
  golden_apple,
  iron_sword,
  netherite_sword,
} from '@minecraft-assets/ui/items';
import {
  stone,
  dirt,
  grass_block_top,
  oak_planks,
  cobblestone,
  diamond_block,
  gold_block,
  iron_block,
  emerald_block,
} from '@minecraft-assets/ui/blocks';

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>Minecraft Assets Demo</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Minerais</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={diamond} alt="Diamond" size={64} />
          <MinecraftIcon src={emerald} alt="Emerald" size={64} />
          <MinecraftIcon src={iron_ingot} alt="Iron Ingot" size={64} />
          <MinecraftIcon src={gold_ingot} alt="Gold Ingot" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Épées</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={iron_sword} alt="Iron Sword" size={64} />
          <MinecraftIcon src={diamond_sword} alt="Diamond Sword" size={64} />
          <MinecraftIcon
            src={netherite_sword}
            alt="Netherite Sword"
            size={64}
          />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Armure en diamant</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={diamond_helmet} alt="Diamond Helmet" size={64} />
          <MinecraftIcon
            src={diamond_chestplate}
            alt="Diamond Chestplate"
            size={64}
          />
          <MinecraftIcon
            src={diamond_leggings}
            alt="Diamond Leggings"
            size={64}
          />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Outils</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon
            src={diamond_pickaxe}
            alt="Diamond Pickaxe"
            size={64}
          />
          <MinecraftIcon src={golden_apple} alt="Golden Apple" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Blocs</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={stone} alt="Stone" size={64} />
          <MinecraftIcon src={dirt} alt="Dirt" size={64} />
          <MinecraftIcon src={grass_block_top} alt="Grass Block" size={64} />
          <MinecraftIcon src={cobblestone} alt="Cobblestone" size={64} />
          <MinecraftIcon src={oak_planks} alt="Oak Planks" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Blocs précieux</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={diamond_block} alt="Diamond Block" size={64} />
          <MinecraftIcon src={emerald_block} alt="Emerald Block" size={64} />
          <MinecraftIcon src={gold_block} alt="Gold Block" size={64} />
          <MinecraftIcon src={iron_block} alt="Iron Block" size={64} />
        </div>
      </section>
    </div>
  );
}
