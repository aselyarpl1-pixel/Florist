import { supabase } from "@/integrations/supabase/client";

// Import all local images to create a mapping
import buketMawarImg from "@/assets/products/buket-mawar.jpg";
import hampersLebaranImg from "@/assets/products/hampers-lebaran.jpg";
import kueUlangTahunImg from "@/assets/products/kue-ulang-tahun.jpg";
import buketMatahariImg from "@/assets/products/buket-matahari.jpg";
import hampersBayiImg from "@/assets/products/hampers-bayi.jpg";
import dekorasiLamaranImg from "@/assets/products/dekorasi-lamaran.jpg";
import buketLilyImg from "@/assets/products/buket-lily.jpg";
import kuePengantinImg from "@/assets/products/kue-pengantin.jpg";
import papanDukaImg from "@/assets/products/papanDuka.jpg";
import parselNatalImg from "@/assets/products/parselNatal.jpg";
import paketNatalEkslusifImg from "@/assets/products/paketNatalEkslusif.jpg";
import paketNatalSpecialImg from "@/assets/products/paketNatalSpecial.jpg";
import DekorasilamaransimpleImg from "@/assets/products/Dekorasilamaransimple.jpg";
import DekorasilamaranImg from "@/assets/products/Dekorasilamaran.jpg";
import Papanbunga_akrilikImg from "@/assets/products/Papanbunga_akrilik.jpg";
import PapanBungaHappyWeddingBalImg from "@/assets/products/PapanBungaHappyWeddingBal.jpg";
import papandukacitaImg from "@/assets/products/papandukacita.jpg";
import BentoCakeImg from "@/assets/products/BentoCake.jpg";
import HampersLebaranImg from "@/assets/products/hampersLebaran.jpg";

const localImageMap: Record<string, string> = {
  "buket-mawar.jpg": buketMawarImg,
  "hampers-lebaran.jpg": hampersLebaranImg,
  "kue-ulang-tahun.jpg": kueUlangTahunImg,
  "buket-matahari.jpg": buketMatahariImg,
  "hampers-bayi.jpg": hampersBayiImg,
  "dekorasi-lamaran.jpg": dekorasiLamaranImg,
  "buket-lily.jpg": buketLilyImg,
  "kue-pengantin.jpg": kuePengantinImg,
  "papanDuka.jpg": papanDukaImg,
  "parselNatal.jpg": parselNatalImg,
  "paketNatalEkslusif.jpg": paketNatalEkslusifImg,
  "paketNatalSpecial.jpg": paketNatalSpecialImg,
  "Dekorasilamaransimple.jpg": DekorasilamaransimpleImg,
  "Dekorasilamaran.jpg": DekorasilamaranImg,
  "Papanbunga_akrilik.jpg": Papanbunga_akrilikImg,
  "PapanBungaHappyWeddingBal.jpg": PapanBungaHappyWeddingBalImg,
  "papandukacita.jpg": papandukacitaImg,
  "BentoCake.jpg": BentoCakeImg,
  "hampersLebaran.jpg": HampersLebaranImg,
};

/**
 * Resolves a product image path to a usable URL.
 * Handles local assets, full URLs, and Supabase Storage paths.
 */
export const getProductImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.svg';
  
  // 1. If it's already a full URL or a data URL, return it
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // 2. Check if it's a known local asset filename
  const fileName = path.split('/').pop() || "";
  if (localImageMap[fileName]) {
    return localImageMap[fileName];
  }

  // 3. If it looks like a local asset path, return it
  if (path.startsWith('/src/') || path.startsWith('/assets/') || path.includes('assets/products/')) {
    return path;
  }

  // 4. If Supabase is NOT configured, treat it as a local path or placeholder
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || 
      import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
    return path;
  }

  // 5. Otherwise, it's likely a Supabase Storage path
  try {
    const { data } = supabase.storage.from('products').getPublicUrl(path);
    return data?.publicUrl || '/placeholder.svg';
  } catch (e) {
    console.error("Error getting public URL from Supabase:", e);
    return path;
  }
};
